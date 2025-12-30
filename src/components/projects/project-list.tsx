'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { MoreVertical, Pencil, Trash2, FolderOpen } from "lucide-react";
import { deleteProject } from '@/lib/db/actions/project-actions';
import { toast } from '@/hooks/use-toast';
import { useTransition } from 'react';

interface ProjectListProps {
    projects: any[];
}

const statusLabels = {
    PLANNING: "Planejamento",
    ACTIVE: "Ativo",
    ON_HOLD: "Em Espera",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado"
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    PLANNING: "secondary",
    ACTIVE: "default",
    ON_HOLD: "outline",
    COMPLETED: "default",
    CANCELLED: "destructive"
};

export function ProjectList({ projects }: ProjectListProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm(`Tem certeza que deseja excluir o projeto "${name}"?`)) {
            return;
        }

        startTransition(async () => {
            const result = await deleteProject(id);
            if (result.success) {
                toast({ title: "Projeto excluído com sucesso!" });
                router.refresh();
            } else {
                toast({ title: "Erro ao excluir projeto", variant: "destructive" });
            }
        });
    };

    const handleRowClick = (projectId: string, e: React.MouseEvent) => {
        // Don't navigate if clicking on button or inside dropdown
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="menu"]')) {
            return;
        }
        router.push(`/projects/${projectId}`);
    };

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FolderOpen className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">Nenhum projeto encontrado</p>
                <p className="text-sm">Crie seu primeiro projeto para começar!</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((project) => (
                        <TableRow
                            key={project.id}
                            onClick={(e) => handleRowClick(project.id, e)}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            <TableCell>
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="flex items-center gap-3 w-full"
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                                        style={{ backgroundColor: project.color || '#3b82f6' }}
                                    >
                                        {project.icon || '📁'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium">{project.name}</div>
                                        {project.description && (
                                            <div className="text-sm text-muted-foreground truncate">
                                                {project.description}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge variant={statusVariants[project.status] || "default"}>
                                    {statusLabels[project.status as keyof typeof statusLabels]}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/projects/${project.id}`);
                                        }}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Ver Detalhes
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => handleDelete(project.id, project.name, e)}
                                            className="text-destructive"
                                            disabled={isPending}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
