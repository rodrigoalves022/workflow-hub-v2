import { Button } from "@/components/ui/button";
import { testDbConnection } from "@/lib/db/client";
import Link from "next/link";

export default async function Home() {
    // Testa conexão com banco na renderização do servidor
    let dbStatus = "❌ Desconectado";
    try {
        const isConnected = await testDbConnection();
        dbStatus = isConnected ? "✅ Conectado ao PostgreSQL" : "❌ Erro na conexão";
    } catch (error) {
        dbStatus = `❌ Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <main className="flex flex-col items-center gap-8 max-w-2xl">
                <div className="flex flex-col items-center gap-4 text-center">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        WorkFlow Hub v2.0
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Plataforma de Gestão de Trabalho Inteligente
                    </p>
                </div>

                <div className="flex flex-col gap-4 p-6 rounded-lg border bg-card text-card-foreground shadow-lg w-full">
                    <h2 className="text-2xl font-semibold">Status do Sistema</h2>

                    <div className="grid gap-3">
                        <StatusItem label="Next.js 15" status="✅ App Router" />
                        <StatusItem label="TypeScript" status="✅ Configurado" />
                        <StatusItem label="Tailwind CSS" status="✅ Funcionando" />
                        <StatusItem label="Shadcn/ui" status="✅ Instalado" />
                        <StatusItem label="Drizzle ORM" status="✅ Configurado" />
                        <StatusItem label="PostgreSQL" status={dbStatus} />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link href="/dashboard">
                        <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            Ver Dashboard
                        </Button>
                    </Link>
                    <Link href="/projects">
                        <Button size="lg" variant="outline" className="rounded-full">
                            Gerenciar Projetos
                        </Button>
                    </Link>
                </div>

                <div className="text-sm text-muted-foreground">
                    🚀 Fase 1 - Sprint 2 em andamento
                </div>
            </main>
        </div>
    );
}


function StatusItem({ label, status }: { label: string; status: string }) {
    return (
        <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
            <span className="font-medium">{label}</span>
            <span className="text-sm">{status}</span>
        </div>
    );
}
