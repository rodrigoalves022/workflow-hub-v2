'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, GripVertical } from 'lucide-react';
import type { Task } from '@/lib/db/schema';

interface TaskCardProps {
    task: any; // Task with relations
}

const priorityConfig = {
    CRITICAL: { color: 'bg-red-500', label: 'CRÍTICA' },
    HIGH: { color: 'bg-orange-500', label: 'ALTA' },
    MEDIUM: { color: 'bg-yellow-500', label: 'MÉDIA' },
    LOW: { color: 'bg-green-500', label: 'BAIXA' },
    NONE: { color: 'bg-gray-300', label: 'NENHUMA' },
};

export function TaskCard({ task }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const priority = priorityConfig[task.priority as keyof typeof priorityConfig];

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="mb-3"
        >
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                            {/* Title */}
                            <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                                {task.title}
                            </h4>

                            {/* Description */}
                            {task.description && (
                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                    {task.description}
                                </p>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between gap-2">
                                {/* Priority Badge */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${priority.color}`} />
                                    <span className="text-xs text-muted-foreground">{priority.label}</span>
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(task.dueDate).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit'
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Assignee Avatar */}
                                {task.assignee && (
                                    <Avatar className="w-6 h-6">
                                        <AvatarFallback className="text-xs">
                                            {task.assignee.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
