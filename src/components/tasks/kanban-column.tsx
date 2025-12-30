'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './task-card';
import { Badge } from '@/components/ui/badge';
import { Circle, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: any[];
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
}

const statusIcons = {
    PENDING: Circle,
    IN_PLANNING: Clock,
    IN_PROGRESS: Clock,
    BLOCKED: AlertCircle,
    COMPLETED: CheckCircle2,
    CANCELLED: XCircle,
};

const statusColors = {
    PENDING: 'bg-gray-100 border-gray-300',
    IN_PLANNING: 'bg-blue-50 border-blue-300',
    IN_PROGRESS: 'bg-yellow-50 border-yellow-300',
    BLOCKED: 'bg-orange-50 border-orange-300',
    COMPLETED: 'bg-green-50 border-green-300',
    CANCELLED: 'bg-red-50 border-red-300',
};

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    const Icon = statusIcons[id as keyof typeof statusIcons] || Circle;
    const colorClass = statusColors[id as keyof typeof statusColors] || 'bg-gray-50';

    return (
        <div className="flex flex-col min-w-0">
            {/* Column Header */}
            <div className={`p-4 rounded-t-lg border-b-2 ${colorClass}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <h3 className="font-semibold text-sm">{title}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {tasks.length}
                    </Badge>
                </div>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className={`flex-1 p-3 bg-muted/30 rounded-b-lg border-2 border-t-0 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto transition-colors ${isOver ? 'bg-primary/10 border-primary' : 'border-transparent'
                    }`}
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                            <Icon className="w-8 h-8 mb-2 opacity-30" />
                            <p className="text-sm">Nenhuma tarefa</p>
                        </div>
                    ) : (
                        tasks.map((task) => <TaskCard key={task.id} task={task} />)
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
