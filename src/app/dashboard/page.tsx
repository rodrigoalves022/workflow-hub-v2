import { getDashboardStats, getRecentActivity, getActiveProjects } from "@/lib/db/actions/dashboard-actions";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ActiveProjects } from "@/components/dashboard/active-projects";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/components/user/user-menu";

export default async function DashboardPage() {
    const [statsResult, activityResult, projectsResult] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(10),
        getActiveProjects(5)
    ]);

    const stats = statsResult.success ? statsResult.data : {
        projects: { total: 0, active: 0, planning: 0, completed: 0 },
        tasks: { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 }
    };

    const activities = activityResult.success ? activityResult.data : [];
    const activeProjects = projectsResult.success ? projectsResult.data : [];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-6 h-6 text-primary" />
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-sm text-muted-foreground">
                                Visão geral do sistema
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/projects">
                            <Button variant="outline">
                                Ver Projetos
                            </Button>
                        </Link>
                        <Link href="/projects">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Projeto
                            </Button>
                        </Link>
                        <UserMenu />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 py-8">
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <DashboardStats stats={stats} />

                    {/* Two Column Layout */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Active Projects */}
                        <ActiveProjects projects={activeProjects} />

                        {/* Recent Activity */}
                        <RecentActivity activities={activities} />
                    </div>
                </div>
            </main>
        </div>
    );
}
