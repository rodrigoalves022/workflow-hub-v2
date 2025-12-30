import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime, getActivityActionLabel } from "@/lib/date-utils";
import { FileText, MessageSquare, Edit, Trash2, Plus } from "lucide-react";

interface Activity {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    userId: string;
    createdAt: Date;
}

interface RecentActivityProps {
    activities: Activity[];
}

const actionIcons: Record<string, any> = {
    CREATE: Plus,
    UPDATE: Edit,
    DELETE: Trash2,
    COMMENT: MessageSquare,
    STATUS_CHANGE: Edit,
};

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
                {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Nenhuma atividade recente
                    </p>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => {
                            const Icon = actionIcons[activity.action] || FileText;
                            const actionLabel = getActivityActionLabel(activity.action);

                            return (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm">
                                            <span className="font-medium">{actionLabel}</span>
                                            {' '}em{' '}
                                            <span className="text-muted-foreground">
                                                {activity.entityType.toLowerCase()}
                                            </span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatRelativeTime(activity.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
