'use server';

import { db, projects, users, taskTypes, tasks } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { NewProject, NewTask, NewUser, NewTaskType } from '@/lib/db/schema';


// ==========================================
// SEED / UTILS
// ==========================================

/**
 * Cria dados básicos para teste (usuário default e tipos de tarefa)
 */
export async function seedInitialData() {
    if (!db) return { error: 'Database not connected' };

    try {
        // 1. Criar usuário default se não existir
        const existingUsers = await db.select().from(users).limit(1);
        let defaultUser;

        if (existingUsers.length === 0) {
            const [newUser] = await db.insert(users).values({
                email: 'admin@coreti.expert',
                name: 'Administrador WIP',
                role: 'OWNER'
            }).returning();
            defaultUser = newUser;
        } else {
            defaultUser = existingUsers[0];
        }

        // 2. Criar tipos de tarefa básicos
        const types = [
            { name: 'Desenvolvimento', icon: '💻', color: '#3b82f6' },
            { name: 'Design', icon: '🎨', color: '#ec4899' },
            { name: 'Reunião', icon: '🤝', color: '#8b5cf6' },
            { name: 'Bug', icon: '🐛', color: '#ef4444' },
            { name: 'Documentação', icon: '📄', color: '#6b7280' }
        ];

        for (const type of types) {
            const existing = await db.select().from(taskTypes).where(eq(taskTypes.name, type.name)).limit(1);
            if (existing.length === 0) {
                await db.insert(taskTypes).values(type);
            }
        }

        return { success: true, userId: defaultUser.id };
    } catch (error) {
        console.error('Seed error:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

/**
 * Retorna o ID do primeiro usuário ativo (para usar em vez de MOCK_USER_ID)
 */
export async function getDefaultUserId(): Promise<string | null> {
    if (!db) return null;
    try {
        const user = await db.select({ id: users.id })
            .from(users)
            .where(eq(users.isActive, true))
            .limit(1);

        if (user.length === 0) {
            // Se não há usuário, cria um automaticamente
            const seedResult = await seedInitialData();
            return seedResult.userId || null;
        }

        return user[0].id;
    } catch (error) {
        console.error('getDefaultUserId error:', error);
        return null;
    }
}


// ==========================================
// PROJECT ACTIONS
// ==========================================

export async function getProjects() {
    if (!db) return [];
    try {
        return await db.query.projects.findMany({
            orderBy: [desc(projects.createdAt)],
            with: {
                owner: true
            }
        });
    } catch (error) {
        console.error('getProjects error:', error);
        return [];
    }
}

export async function createProject(data: NewProject) {
    if (!db) return { error: 'Database not connected' };
    try {
        const [project] = await db.insert(projects).values(data).returning();
        revalidatePath('/projects');
        return { success: true, project };
    } catch (error) {
        console.error('createProject error:', error);
        return { error: 'Failed to create project' };
    }
}

export async function updateProject(id: string, data: Partial<NewProject>) {
    if (!db) return { error: 'Database not connected' };
    try {
        const [project] = await db.update(projects)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(projects.id, id))
            .returning();
        revalidatePath('/projects');
        return { success: true, project };
    } catch (error) {
        console.error('updateProject error:', error);
        return { error: 'Failed to update project' };
    }
}

export async function deleteProject(id: string) {
    if (!db) return { error: 'Database not connected' };
    try {
        await db.delete(projects).where(eq(projects.id, id));
        revalidatePath('/projects');
        return { success: true };
    } catch (error) {
        console.error('deleteProject error:', error);
        return { error: 'Failed to delete project' };
    }
}
