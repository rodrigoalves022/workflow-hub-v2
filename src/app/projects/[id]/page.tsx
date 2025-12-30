import { notFound } from "next/navigation";
import { ArrowLeft, Plus, FolderOpen, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/tasks/task-list";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { UserMenu } from "@/components/user/user-menu";
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

export default async function ProjectDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const project = await getProjectWithTasks(id);

    if (!project) {
        notFound();
    }

    const taskStats = {
        total: project.tasks.length,
        completed: project.tasks.filter(t => t.status === 'COMPLETED').length,
        inProgress: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
        pending: project.tasks.filter(t => t.status === 'PENDING').length,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: project.color || '#3b82f6' }}
                            >
                                {project.icon || <FolderOpen className="w-5 h-5" />}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="outline" className="font-normal">
                                        {statusLabels[project.status as keyof typeof statusLabels]}
                                    </Badge>
                                    <span>•</span>
                                    <span>{taskStats.total} tarefas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.id}/kanban`}>
                            <Button variant="outline" className="gap-2">
                                <LayoutGrid className="w-4 h-4" /> Ver Kanban
                            </Button>
                        </Link>
                        <TaskDialog projectId={project.id}>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" /> Nova Tarefa
                            </Button>
                        </TaskDialog>
                        <UserMenu />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 py-8">
                {/* Project Info */}
                {project.description && (
                    <div className="mb-8 p-6 rounded-lg border bg-card">
                        <h2 className="text-sm font-semibold text-muted-foreground mb-2">Descrição do Projeto</h2>
                        <p className="text-base">{project.description}</p>
                    </div>
                )}

                {/* Task Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="text-2xl font-bold">{taskStats.total}</div>
                        <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</div>
                        <div className="text-sm text-muted-foreground">Em Progresso</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="text-2xl font-bold text-gray-600">{taskStats.pending}</div>
                        <div className="text-sm text-muted-foreground">Pendentes</div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
                        <div className="text-sm text-muted-foreground">Concluídas</div>
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Tarefas</h2>
                    </div>

                    <TaskList tasks={project.tasks} projectId={project.id} />
                </div>
            </main>
        </div>
    );
}
