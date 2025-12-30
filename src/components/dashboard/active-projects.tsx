import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ActiveProject {
    id: string;
    name: string;
    status: string;
    color: string | null;
    taskCount: number;
    completedTasks: number;
    progress: number;
}

interface ActiveProjectsProps {
    projects: ActiveProject[];
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projetos Ativos</CardTitle>
                <Link href="/projects">
                    <Button variant="ghost" size="sm">
                        Ver todos
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {projects.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Nenhum projeto ativo
                    </p>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className="block group"
                            >
                                <div className="space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: project.color || '#3b82f6' }}
                                            />
                                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                                                {project.name}
                                            </h4>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {project.completedTasks}/{project.taskCount}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <Progress value={project.progress} className="h-2" />
                                        <p className="text-xs text-muted-foreground">
                                            {project.progress}% concluído
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
