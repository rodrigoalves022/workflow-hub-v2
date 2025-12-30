import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface DashboardStatsProps {
    stats: {
        projects: {
            total: number;
            active: number;
            planning: number;
            completed: number;
        };
        tasks: {
            total: number;
            pending: number;
            inProgress: number;
            completed: number;
            overdue: number;
        };
    };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    const statCards = [
        {
            title: "Projetos Ativos",
            value: stats.projects.active,
            total: stats.projects.total,
            icon: FolderKanban,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Tarefas Concluídas",
            value: stats.tasks.completed,
            total: stats.tasks.total,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Em Progresso",
            value: stats.tasks.inProgress,
            total: stats.tasks.total,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Tarefas Atrasadas",
            value: stats.tasks.overdue,
            total: stats.tasks.total,
            icon: AlertCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
                const Icon = card.icon;
                const percentage = card.total > 0
                    ? Math.round((card.value / card.total) * 100)
                    : 0;

                return (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                <Icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {percentage}% do total ({card.total})
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
