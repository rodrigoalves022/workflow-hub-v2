'use server';

import { db, comments, auditLogs, users } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { NewComment, NewAuditLog } from '@/lib/db/schema';

// ==========================================
// COMMENT ACTIONS
// ==========================================

/**
 * Get all comments for a task
 */
export async function getComments(taskId: string) {
    if (!db) return [];
    try {
        return await db.query.comments.findMany({
            where: eq(comments.taskId, taskId),
            orderBy: [desc(comments.createdAt)],
            with: {
                author: true,
            },
        });
    } catch (error) {
        console.error('getComments error:', error);
        return [];
    }
}

/**
 * Add a new comment to a task
 */
export async function addComment(taskId: string, userId: string, content: string) {
    if (!db) return { error: 'Database not connected' };

    if (!content.trim()) {
        return { error: 'Comment content is required' };
    }

    try {
        const [comment] = await db.insert(comments).values({
            taskId,
            userId,
            content: content.trim(),
        }).returning();

        // Log the comment activity
        await logActivity(taskId, 'TASK', 'COMMENTED', userId, {
            commentId: comment.id,
            content: content.substring(0, 100), // First 100 chars
        });

        revalidatePath(`/projects`);
        return { success: true, comment };
    } catch (error) {
        console.error('addComment error:', error);
        return { error: 'Failed to add comment' };
    }
}

// ==========================================
// ACTIVITY LOG ACTIONS
// ==========================================

/**
 * Get activity timeline for an entity (task or project)
 */
export async function getActivityTimeline(entityId: string, entityType: 'TASK' | 'PROJECT' = 'TASK') {
    if (!db) return [];
    try {
        return await db.query.auditLogs.findMany({
            where: eq(auditLogs.entityId, entityId),
            orderBy: [desc(auditLogs.createdAt)],
            with: {
                user: true,
            },
        });
    } catch (error) {
        console.error('getActivityTimeline error:', error);
        return [];
    }
}

/**
 * Log an activity (internal helper)
 */
export async function logActivity(
    entityId: string,
    entityType: 'TASK' | 'PROJECT',
    action: 'CREATED' | 'UPDATED' | 'DELETED' | 'STATUS_CHANGED' | 'ASSIGNED' | 'COMMENTED',
    userId: string | null,
    details?: object
) {
    if (!db) return;

    try {
        await db.insert(auditLogs).values({
            entityId,
            entityType,
            action,
            userId: userId || null,
            details: details ? JSON.stringify(details) : null,
        });
    } catch (error) {
        console.error('logActivity error:', error);
        // Don't throw - logging should not break the main operation
    }
}
