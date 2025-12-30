
import { db } from './index';
import { projects, tasks, taskTypes } from './schema';

async function checkDb() {
    try {
        console.log('Checking database connection and content...');
        const allProjects = await db.select().from(projects);
        console.log(`Found ${allProjects.length} projects.`);
        allProjects.forEach(p => console.log(`- Project: ${p.name} (ID: ${p.id})`));

        const allTypes = await db.select().from(taskTypes);
        console.log(`Found ${allTypes.length} task types.`);

        // Check specific project from previous logs if possible, or just pick one
        if (allProjects.length > 0) {
            const pid = allProjects[0].id;
            console.log(`Checking details for project ${pid}...`);

            // Simulate getProjectWithTasks query
            const project = await db.query.projects.findFirst({
                where: (projects, { eq }) => eq(projects.id, pid),
                with: {
                    tasks: {
                        with: {
                            type: true,
                        }
                    }
                }
            });
            console.log('Project fetch result:', project ? 'Found' : 'Null');
            if (project) {
                console.log('Project tasks count:', project.tasks.length);
            }
        }

    } catch (error) {
        console.error('Database check failed:', error);
    }
    process.exit(0);
}

checkDb();
