'use client';

import { useUserContext, type User } from '@/contexts/user-context';

export function useCurrentUser() {
    const { user, setUser, isLoading, logout } = useUserContext();

    return {
        user,
        userId: user?.id || null,
        userName: user?.name || 'Usuário',
        userEmail: user?.email || '',
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        setUser,
        logout,
    };
}

export type { User };
