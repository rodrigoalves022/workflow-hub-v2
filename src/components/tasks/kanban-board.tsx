'use client';

import { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { updateTask } from '@/lib/db/actions/task-actions';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface KanbanBoardProps {
    tasks: any[];
    projectId: string;
}

const columns = [
    { id: 'PENDING', title: 'Pendente' },
    { id: 'IN_PLANNING', title: 'Planejamento' },
    { id: 'IN_PROGRESS', title: 'Em Progresso' },
    { id: 'BLOCKED', title: 'Bloqueada' },
    { id: 'COMPLETED', title: 'Concluída' },
    { id: 'CANCELLED', title: 'Cancelada' },
];

export function KanbanBoard({ tasks, projectId }: KanbanBoardProps) {
    const router = useRouter();
    const [activeTask, setActiveTask] = useState<any | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Group tasks by status
    const tasksByStatus = columns.reduce((acc, column) => {
        acc[column.id] = tasks.filter(task => task.status === column.id);
        return acc;
    }, {} as Record<string, any[]>);

    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.id === event.active.id);
        setActiveTask(task);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as string;
        const newStatus = over.id as string;

        // Find the task to get its current status
        const task = tasks.find(t => t.id === taskId);
        if (!task || task.status === newStatus) return;

        // Optimistically update UI (already done by DnD)
        const result = await updateTask(taskId, { status: newStatus as any });

        if (result.success) {
            toast({
                title: "✅ Status atualizado!",
            });
        } else {
            toast({
                title: "❌ Erro ao atualizar",
                description: "Recarregue a página e tente novamente.",
                variant: "destructive",
            });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-6 gap-4">
                {columns.map((column) => (
                    <KanbanColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        tasks={tasksByStatus[column.id] || []}
                    />
                ))}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeTask ? (
                    <div className="opacity-80 rotate-3">
                        <TaskCard task={activeTask} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
