'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Circle,
    Edit,
    Trash2,
    ArrowRightLeft,
    UserPlus,
    MessageSquare
} from 'lucide-react';
import { formatRelativeTime, formatActivityAction } from '@/lib/date-utils';

interface ActivityTimelineProps {
    activities: any[]; // Audit logs with user relation
}

const actionIcons = {
    CREATED: Circle,
    UPDATED: Edit,
    DELETED: Trash2,
    STATUS_CHANGED: ArrowRightLeft,
    ASSIGNED: UserPlus,
    COMMENTED: MessageSquare,
};

const actionColors = {
    CREATED: 'text-green-500',
    UPDATED: 'text-blue-500',
    DELETED: 'text-red-500',
    STATUS_CHANGED: 'text-yellow-500',
    ASSIGNED: 'text-purple-500',
    COMMENTED: 'text-gray-500',
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Circle className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">Nenhuma atividade registrada</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.map((activity, index) => {
                const Icon = actionIcons[activity.action as keyof typeof actionIcons] || Circle;
                const colorClass = actionColors[activity.action as keyof typeof actionColors] || 'text-gray-500';
                const details = activity.details ? JSON.parse(activity.details) : {};

                return (
                    <div key={activity.id} className="flex gap-3 relative">
                        {/* Timeline line */}
                        {index < activities.length - 1 && (
                            <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                        )}

                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center z-10 ${colorClass}`}>
                            <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                {activity.user ? (
                                    <>
                                        <Avatar className="w-5 h-5">
                                            <AvatarFallback className="text-xs bg-primary/10">
                                                {activity.user.name
                                                    ?.split(' ')
                                                    .map((n: string) => n[0])
                                                    .join('')
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold text-sm">{activity.user.name}</span>
                                    </>
                                ) : (
                                    <span className="font-semibold text-sm text-muted-foreground">Sistema</span>
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {formatActivityAction(activity.action, details)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    • {formatRelativeTime(activity.createdAt)}
                                </span>
                            </div>

                            {/* Additional details */}
                            {details.content && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    &quot;{details.content}&quot;
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
