import { getProjects } from "@/lib/db/actions/project-actions";
import { ProjectList } from "@/components/projects/project-list";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "@/components/user/user-menu";

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="w-6 h-6 text-primary" />
                            <h1 className="text-xl font-bold tracking-tight">Projetos</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ProjectDialog />
                        <UserMenu />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Seus Projetos</h2>
                    <p className="text-muted-foreground">
                        Gerencie seus projetos e acompanhe o progresso de cada um.
                    </p>
                </div>

                <ProjectList projects={projects} />
            </main>
        </div>
    );
}
