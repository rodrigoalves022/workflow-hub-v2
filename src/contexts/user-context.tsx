'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: 'ADMIN' | 'USER';
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: React.ReactNode;
    initialUser?: User | null;
}

export function UserProvider({ children, initialUser = null }: UserProviderProps) {
    const [user, setUserState] = useState<User | null>(initialUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Tentar carregar usuário do localStorage
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem('workflow_user');
                if (storedUser) {
                    setUserState(JSON.parse(storedUser));
                } else {
                    // Usuário mock padrão para desenvolvimento
                    const mockUser: User = {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        name: 'Usuário Demo',
                        email: 'demo@workflow.com',
                        role: 'ADMIN',
                    };
                    setUserState(mockUser);
                    localStorage.setItem('workflow_user', JSON.stringify(mockUser));
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const setUser = (newUser: User | null) => {
        setUserState(newUser);
        if (newUser) {
            localStorage.setItem('workflow_user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('workflow_user');
        }
    };

    const logout = () => {
        setUserState(null);
        localStorage.removeItem('workflow_user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}
