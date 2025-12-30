/**
 * Format a date as relative time (e.g., "há 2 horas", "há 3 dias")
 */
export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) {
        return 'agora mesmo';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
        return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
        return `há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
    }

    const years = Math.floor(days / 365);
    return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

/**
 * Format activity action to Portuguese
 */
export function formatActivityAction(action: string, details?: any): string {
    const detailsObj = typeof details === 'string' ? JSON.parse(details) : details;

    switch (action) {
        case 'CREATED':
            return 'criou a tarefa';
        case 'UPDATED':
            return 'atualizou a tarefa';
        case 'DELETED':
            return 'excluiu a tarefa';
        case 'STATUS_CHANGED':
            if (detailsObj?.newStatus) {
                const statusLabels: Record<string, string> = {
                    PENDING: 'Pendente',
                    IN_PLANNING: 'Planejamento',
                    IN_PROGRESS: 'Em Progresso',
                    COMPLETED: 'Concluída',
                    BLOCKED: 'Bloqueada',
                    CANCELLED: 'Cancelada',
                };
                return `mudou status para ${statusLabels[detailsObj.newStatus] || detailsObj.newStatus}`;
            }
            return 'mudou o status';
        case 'ASSIGNED':
            return 'atribuiu a tarefa';
        case 'COMMENTED':
            return 'comentou';
        default:
            return action.toLowerCase();
    }
}
