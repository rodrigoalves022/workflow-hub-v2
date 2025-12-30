
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, taskTypes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        if (!db) {
            return NextResponse.json({ error: 'Database connection failed (db is null)' }, { status: 500 });
        }

        // Check projects
        const allProjects = await db.select().from(projects);
        const allTypes = await db.select().from(taskTypes);

        // Test the specific query used in page.tsx
        let specificProject = null;
        let errorDetail = null;

        if (allProjects.length > 0) {
            try {
                specificProject = await db.query.projects.findFirst({
                    where: eq(projects.id, allProjects[0].id),
                    with: {
                        tasks: {
                            with: {
                                type: true
                            }
                        }
                    }
                });
            } catch (e: any) {
                errorDetail = e.message;
            }
        }

        return NextResponse.json({
            status: 'ok',
            projectCount: allProjects.length,
            firstProjectId: allProjects[0]?.id,
            typesCount: allTypes.length,
            types: allTypes.map(t => ({ name: t.name, isActive: t.isActive, hasUpdatedAt: typeof t.updatedAt !== 'undefined' })),
            specificProjectQuery: specificProject ? 'Success' : 'Failed or Null',
            specificProjectError: errorDetail
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
