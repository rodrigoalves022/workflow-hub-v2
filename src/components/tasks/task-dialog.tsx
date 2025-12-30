'use client';

import { useState, useTransition, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { createTask, updateTask } from '@/lib/db/actions/task-actions';
import { getComments, getActivityTimeline } from '@/lib/db/actions/collaboration-actions';
import { getDefaultUserId } from '@/lib/db/actions/project-actions';
import { CommentSection } from './collaboration/CommentSection';
import { ActivityTimeline } from './collaboration/ActivityTimeline';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface TaskDialogProps {
    projectId: string;
    task?: any; // Task to edit (optional)
    children?: React.ReactNode; // Trigger button
    open?: boolean; // Controlled open state
    onOpenChange?: (open: boolean) => void; // Controlled open change handler
}

export function TaskDialog({ projectId, task, children, open: controlledOpen, onOpenChange }: TaskDialogProps) {
    const router = useRouter();
    const [internalOpen, setInternalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [comments, setComments] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('details');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Use controlled or internal state
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    // Fetch real user ID on mount
    useEffect(() => {
        async function fetchUserId() {
            const userId = await getDefaultUserId();
            setCurrentUserId(userId);
        }
        fetchUserId();
    }, []);

    // Load comments and activities when dialog opens for existing task
    useEffect(() => {
        if (open && task?.id) {
            loadCollaborationData(task.id);
        }
    }, [open, task?.id]);

    const loadCollaborationData = async (taskId: string) => {
        const [commentsData, activitiesData] = await Promise.all([
            getComments(taskId),
            getActivityTimeline(taskId, 'TASK'),
        ]);
        setComments(commentsData);
        setActivities(activitiesData);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const data = {
            projectId,
            title: formData.get('title') as string,
            description: formData.get('description') as string || null,
            status: formData.get('status') as any || 'PENDING',
            priority: formData.get('priority') as any || 'MEDIUM',
            dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null,
            reporterId: currentUserId || undefined,
        };

        if (!data.title) {
            toast({ title: "Título é obrigatório", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            const result = task
                ? await updateTask(task.id, data)
                : await createTask(data);

            if (result.success) {
                toast({ title: task ? "Tarefa atualizada!" : "Tarefa criada com sucesso!" });
                setOpen(false);
                router.refresh();
                // Reset form
                (event.target as HTMLFormElement).reset();
            } else {
                toast({ title: "Erro ao salvar tarefa", variant: "destructive" });
            }
        });
    };

    const isNewTask = !task?.id;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {controlledOpen === undefined && (
                <DialogTrigger asChild>
                    {children || (
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Nova Tarefa
                        </Button>
                    )}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>{task ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                        <TabsTrigger value="comments" disabled={isNewTask}>
                            Comentários {!isNewTask && comments.length > 0 && `(${comments.length})`}
                        </TabsTrigger>
                        <TabsTrigger value="history" disabled={isNewTask}>
                            Histórico
                        </TabsTrigger>
                    </TabsList>

                    {/* Details Tab */}
                    <TabsContent value="details" className="flex-1 overflow-y-auto mt-4">
                        <form onSubmit={handleSubmit} id="task-form">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Título da Tarefa *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Ex: Implementar autenticação"
                                        defaultValue={task?.title}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Descrição</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Descreva os detalhes da tarefa..."
                                        defaultValue={task?.description || ''}
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select name="status" defaultValue={task?.status || "PENDING"}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pendente</SelectItem>
                                                <SelectItem value="IN_PLANNING">Planejamento</SelectItem>
                                                <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                                                <SelectItem value="COMPLETED">Concluída</SelectItem>
                                                <SelectItem value="BLOCKED">Bloqueada</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="priority">Prioridade</Label>
                                        <Select name="priority" defaultValue={task?.priority || "MEDIUM"}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CRITICAL">🔴 Crítica</SelectItem>
                                                <SelectItem value="HIGH">🟠 Alta</SelectItem>
                                                <SelectItem value="MEDIUM">🟡 Média</SelectItem>
                                                <SelectItem value="LOW">🟢 Baixa</SelectItem>
                                                <SelectItem value="NONE">⚪ Nenhuma</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="dueDate">Data de Entrega</Label>
                                    <Input
                                        id="dueDate"
                                        name="dueDate"
                                        type="date"
                                        defaultValue={task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                                    />
                                </div>
                            </div>
                        </form>
                    </TabsContent>

                    {/* Comments Tab */}
                    <TabsContent value="comments" className="flex-1 overflow-y-auto mt-4">
                        {!isNewTask && currentUserId && (
                            <CommentSection
                                taskId={task.id}
                                comments={comments}
                                currentUserId={currentUserId}
                                onCommentAdded={(newComment) => {
                                    setComments([newComment, ...comments]);
                                    // Reload activities to show "comentou" log
                                    loadCollaborationData(task.id);
                                }}
                            />
                        )}
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="flex-1 overflow-y-auto mt-4">
                        {!isNewTask && <ActivityTimeline activities={activities} />}
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" form="task-form" disabled={isPending}>
                        {isPending ? 'Salvando...' : task ? 'Atualizar' : 'Criar Tarefa'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
