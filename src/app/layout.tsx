import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/user-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WorkFlow Hub v2.0",
    description: "Plataforma de Gestão de Trabalho Inteligente",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <UserProvider>
                    {children}
                    <Toaster />
                </UserProvider>
            </body>
        </html>
    );
}

