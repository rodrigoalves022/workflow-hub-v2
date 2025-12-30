// Script para aplicar migrations automaticamente
import { execSync } from 'child_process';

console.log('🚀 Aplicando schema ao banco de dados...\n');

try {
    // Usa --yes flag se disponível, senão força com pipe
    execSync('pnpm drizzle-kit push --force', {
        stdio: 'inherit',
        cwd: process.cwd()
    });

    console.log('\n✅ Schema aplicado com sucesso!');
} catch (error) {
    console.error('\n❌ Erro ao aplicar schema:', error.message);
    process.exit(1);
}
