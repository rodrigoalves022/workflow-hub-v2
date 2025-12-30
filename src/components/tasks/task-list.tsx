'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Circle, Clock, MoreHorizontal, Pencil, Trash2, AlertCircle, XCircle } from "lucide-react";
import type { Task } from "@/lib/db/schema";
import { deleteTask } from "@/lib/db/actions/task-actions";
import { useTransition, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { TaskDialog } from "./task-dialog";

interface TaskListProps {
    tasks: any[]; // Will be Task with relations
    projectId: string;
}

const statusConfig = {
    PENDING: { label: "Pendente", icon: Circle, variant: "secondary" as const, color: "text-gray-500" },
    IN_PLANNING: { label: "Planejamento", icon: Clock, variant: "outline" as const, color: "text-blue-500" },
    IN_PROGRESS: { label: "Em Progresso", icon: Clock, variant: "default" as const, color: "text-yellow-500" },
    COMPLETED: { label: "Concluída", icon: CheckCircle2, variant: "default" as const, color: "text-green-500" },
    CANCELLED: { label: "Cancelada", icon: XCircle, variant: "destructive" as const, color: "text-red-500" },
    BLOCKED: { label: "Bloqueada", icon: AlertCircle, variant: "destructive" as const, color: "text-orange-500" },
};

const priorityConfig = {
    CRITICAL: { label: "Crítica", color: "bg-red-500", textColor: "text-red-700" },
    HIGH: { label: "Alta", color: "bg-orange-500", textColor: "text-orange-700" },
    MEDIUM: { label: "Média", color: "bg-yellow-500", textColor: "text-yellow-700" },
    LOW: { label: "Baixa", color: "bg-green-500", textColor: "text-green-700" },
    NONE: { label: "Nenhuma", color: "bg-gray-300", textColor: "text-gray-600" },
};

export function TaskList({ tasks, projectId }: TaskListProps) {
    const [isPending, startTransition] = useTransition();
    const [editingTask, setEditingTask] = useState<any | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

        startTransition(async () => {
            const result = await deleteTask(id);
            if (result.success) {
                toast({ title: "Tarefa excluída!" });
            } else {
                toast({ title: "Erro ao excluir", variant: "destructive" });
            }
        });
    };

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl opacity-60">
                <CheckCircle2 className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
                <p className="text-sm">Comece criando sua primeira tarefa!</p>
            </div>
        );
    }

    const handleRowClick = (task: any, e: React.MouseEvent) => {
        // Don't open dialog if clicking on button or inside dropdown
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="menu"]')) {
            return;
        }
        setEditingTask(task);
    };

    return (
        <>
            <div className="border rounded-lg overflow-hidden glass-morphism">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="w-[300px]">Título</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Prioridade</TableHead>
                            <TableHead>Responsável</TableHead>
                            <TableHead>Prazo</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => {
                            const status = statusConfig[task.status as keyof typeof statusConfig];
                            const priority = priorityConfig[task.priority as keyof typeof priorityConfig];
                            const StatusIcon = status.icon;

                            return (
                                <TableRow
                                    key={task.id}
                                    onClick={(e) => handleRowClick(task, e)}
                                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                                >
                                    <TableCell>
                                        <div className={`w-2 h-2 rounded-full ${priority.color}`} />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>
                                            <div className="font-semibold">{task.title}</div>
                                            {task.description && (
                                                <div className="text-xs text-muted-foreground line-clamp-1 truncate max-w-[250px]">
                                                    {task.description}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={status.variant} className="gap-1">
                                            <StatusIcon className={`w-3 h-3 ${status.color}`} />
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-sm font-medium ${priority.textColor}`}>
                                            {priority.label}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {task.assignee?.name || "Não atribuído"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditingTask(task)}>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(task.id)}
                                                    disabled={isPending}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {editingTask && (
                <TaskDialog
                    task={editingTask}
                    projectId={projectId}
                    open={!!editingTask}
                    onOpenChange={(open) => !open && setEditingTask(null)}
                />
            )}
        </>
    );
}
