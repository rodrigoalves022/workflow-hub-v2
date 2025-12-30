import { notFound } from "next/navigation";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { db, projects, tasks } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

async function getProjectWithTasks(id: string) {
    if (!db) return null;
    try {
        return await db.query.projects.findFirst({
            where: eq(projects.id, id),
            with: {
                owner: true,
                tasks: {
                    orderBy: [desc(tasks.createdAt)],
                    with: {
                        type: true,
                        assignee: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('getProjectWithTasks error:', error);
        return null;
    }
}

const statusLabels = {
    PLANNING: "Planejamento",
    ACTIVE: "Ativo",
    ON_HOLD: "Em Espera",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado"
};

export default async function KanbanPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const project = await getProjectWithTasks(id);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/projects/${project.id}`}>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="w-5 h-5 text-primary" />
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">{project.name} - Kanban</h1>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="outline" className="font-normal">
                                        {statusLabels[project.status as keyof typeof statusLabels]}
                                    </Badge>
                                    <span>•</span>
                                    <span>{project.tasks.length} tarefas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TaskDialog projectId={project.id} />
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 py-6">
                <KanbanBoard tasks={project.tasks} projectId={project.id} />
            </main>
        </div>
    );
}
