'use server';

import { db } from '../client';
import { projects, tasks, auditLogs } from '../schema';
import { eq, desc, and, lt } from 'drizzle-orm';

export async function getDashboardStats() {
    try {
        // Get all projects and tasks
        const allProjects = await db.select().from(projects);
        const allTasks = await db.select().from(tasks);

        // Calculate project stats
        const projectStats = {
            total: allProjects.length,
            active: allProjects.filter(p => p.status === 'ACTIVE').length,
            planning: allProjects.filter(p => p.status === 'PLANNING').length,
            completed: allProjects.filter(p => p.status === 'COMPLETED').length,
        };

        // Calculate task stats
        const now = new Date();
        const taskStats = {
            total: allTasks.length,
            pending: allTasks.filter(t => t.status === 'PENDING').length,
            inProgress: allTasks.filter(t => t.status === 'IN_PROGRESS').length,
            completed: allTasks.filter(t => t.status === 'COMPLETED').length,
            overdue: allTasks.filter(t =>
                t.dueDate &&
                new Date(t.dueDate) < now &&
                t.status !== 'COMPLETED'
            ).length,
        };

        return {
            success: true,
            data: {
                projects: projectStats,
                tasks: taskStats,
            }
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            success: false,
            error: 'Failed to fetch dashboard statistics'
        };
    }
}

export async function getRecentActivity(limit: number = 10) {
    try {
        const activities = await db
            .select()
            .from(auditLogs)
            .orderBy(desc(auditLogs.createdAt))
            .limit(limit);

        return {
            success: true,
            data: activities
        };
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        return {
            success: false,
            error: 'Failed to fetch recent activity',
            data: []
        };
    }
}

export async function getActiveProjects(limit: number = 5) {
    try {
        const activeProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.status, 'ACTIVE'))
            .limit(limit);

        // Get task counts for each project
        const projectsWithTasks = await Promise.all(
            activeProjects.map(async (project) => {
                const projectTasks = await db
                    .select()
                    .from(tasks)
                    .where(eq(tasks.projectId, project.id));

                const completed = projectTasks.filter(t => t.status === 'COMPLETED').length;
                const total = projectTasks.length;
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                return {
                    ...project,
                    taskCount: total,
                    completedTasks: completed,
                    progress
                };
            })
        );

        return {
            success: true,
            data: projectsWithTasks
        };
    } catch (error) {
        console.error('Error fetching active projects:', error);
        return {
            success: false,
            error: 'Failed to fetch active projects',
            data: []
        };
    }
}
