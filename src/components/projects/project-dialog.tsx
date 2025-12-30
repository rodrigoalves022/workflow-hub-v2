'use client';

import { useState, useTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { createProject, updateProject } from '@/lib/db/actions/project-actions';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ProjectDialogProps {
    project?: any; // Project to edit (optional)
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

export function ProjectDialog({ project, open: controlledOpen, onOpenChange, children }: ProjectDialogProps) {
    const router = useRouter();
    const [internalOpen, setInternalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;
    const isEditing = !!project;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const data = {
            name: formData.get('name') as string,
            description: formData.get('description') as string || null,
            status: formData.get('status') as any || 'PLANNING',
            color: formData.get('color') as string || '#3b82f6',
            icon: formData.get('icon') as string || '📁',
        };

        if (!data.name) {
            toast({ title: "Nome é obrigatório", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            const result = isEditing
                ? await updateProject(project.id, data)
                : await createProject(data);

            if (result.success) {
                toast({ title: isEditing ? "✅ Projeto atualizado!" : "✅ Projeto criado!" });
                setOpen(false);
                router.refresh();
            } else {
                toast({ title: "❌ Erro ao salvar projeto", variant: "destructive" });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children || (
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> Novo Projeto
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Projeto' : 'Criar Novo Projeto'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={project?.name}
                                placeholder="Ex: Redesign do Site"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={project?.description}
                                placeholder="Breve descrição do objetivo do projeto..."
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue={project?.status || 'PLANNING'}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PLANNING">Planejamento</SelectItem>
                                        <SelectItem value="ACTIVE">Ativo</SelectItem>
                                        <SelectItem value="ON_HOLD">Em Espera</SelectItem>
                                        <SelectItem value="COMPLETED">Concluído</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="color">Cor</Label>
                                <Input
                                    id="color"
                                    name="color"
                                    type="color"
                                    defaultValue={project?.color || '#3b82f6'}
                                    className="h-10 px-1 py-1"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="icon">Ícone (emoji)</Label>
                            <Input
                                id="icon"
                                name="icon"
                                defaultValue={project?.icon || '📁'}
                                placeholder="📁"
                                maxLength={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar Projeto')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
