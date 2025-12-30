import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Verifica se DATABASE_URL está definida
const DATABASE_URL = process.env.DATABASE_URL;

// Cria cliente apenas se DATABASE_URL existir
const queryClient = DATABASE_URL ? postgres(DATABASE_URL) : null;
export const db = queryClient ? drizzle(queryClient, { schema }) : null;

// Função de teste de conexão
export async function testDbConnection(): Promise<boolean> {
    if (!queryClient) {
        console.warn('DATABASE_URL not set - database connection unavailable');
        return false;
    }

    try {
        await queryClient`SELECT 1`;
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}
