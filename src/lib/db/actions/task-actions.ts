'use server';

import { db, tasks } from '@/lib/db';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { NewTask } from '@/lib/db/schema';
import { logActivity } from './collaboration-actions';


// ==========================================
// TASK ACTIONS
// ==========================================

export async function getTasks(projectId?: string) {
    if (!db) return [];
    try {
        const conditions = projectId ? [eq(tasks.projectId, projectId)] : [];

        return await db.query.tasks.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            orderBy: [desc(tasks.createdAt)],
            with: {
                project: true,
                type: true,
                assignee: true
            }
        });
    } catch (error) {
        console.error('getTasks error:', error);
        return [];
    }
}

export async function createTask(data: NewTask) {
    if (!db) return { error: 'Database not connected' };
    try {
        const [task] = await db.insert(tasks).values(data).returning();

        // Log activity
        await logActivity(task.id, 'TASK', 'CREATED', data.reporterId || null, {
            title: task.title,
            projectId: task.projectId,
        });

        revalidatePath('/tasks');
        if (data.projectId) {
            revalidatePath(`/projects/${data.projectId}`);
        }
        return { success: true, task };
    } catch (error) {
        console.error('createTask error:', error);
        return { error: 'Failed to create task' };
    }
}

export async function updateTask(id: string, data: Partial<NewTask>) {
    if (!db) return { error: 'Database not connected' };
    try {
        // Get old task for comparison
        const oldTask = await db.query.tasks.findFirst({ where: eq(tasks.id, id) });

        const [task] = await db.update(tasks)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(tasks.id, id))
            .returning();

        // Log status change specifically
        if (oldTask && data.status && oldTask.status !== data.status) {
            await logActivity(id, 'TASK', 'STATUS_CHANGED', null, {
                oldStatus: oldTask.status,
                newStatus: data.status,
            });
        } else if (data.assigneeId !== undefined && oldTask && oldTask.assigneeId !== data.assigneeId) {
            await logActivity(id, 'TASK', 'ASSIGNED', null, {
                assigneeId: data.assigneeId,
            });
        } else {
            await logActivity(id, 'TASK', 'UPDATED', null, data);
        }

        revalidatePath('/tasks');
        if (task.projectId) {
            revalidatePath(`/projects/${task.projectId}`);
        }
        return { success: true, task };
    } catch (error) {
        console.error('updateTask error:', error);
        return { error: 'Failed to update task' };
    }
}

export async function deleteTask(id: string) {
    if (!db) return { error: 'Database not connected' };
    try {
        const [task] = await db.delete(tasks).where(eq(tasks.id, id)).returning();

        // Log deletion
        if (task) {
            await logActivity(id, 'TASK', 'DELETED', null, {
                title: task.title,
                projectId: task.projectId,
            });
        }

        revalidatePath('/tasks');
        if (task?.projectId) {
            revalidatePath(`/projects/${task.projectId}`);
        }
        return { success: true };
    } catch (error) {
        console.error('deleteTask error:', error);
        return { error: 'Failed to delete task' };
    }
}
