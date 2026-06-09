'use client';

import { useState, useEffect, useCallback } from 'react';

import { ApiError } from '@/shared/api';
import { User } from '@/shared/types';
import { UserRole } from '@/shared/types/user';

import { fetchUsers, updateUserRole } from './api';

type UseUsersReturn = {
    readonly users: User[];
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly updateRole: (userId: number, newRole: UserRole) => Promise<void>;
};

export const useUsers = (): UseUsersReturn => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (err) {
                const apiErr = err instanceof ApiError ? err : null;
                setError(apiErr?.message || 'Ошибка загрузки пользователей');
            } finally {
                setIsLoading(false);
            }
        };
        void loadData();
    }, []);

    const updateRole = useCallback(
        async (userId: number, newRole: UserRole): Promise<void> => {
            const currentUser = users.find((u) => u.id === userId);
            const previousRole = currentUser?.role ?? null;

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, role: newRole } : u,
                ),
            );
            setError(null);

            try {
                await updateUserRole(userId, newRole);
            } catch {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === userId && previousRole
                            ? { ...u, role: previousRole }
                            : u,
                    ),
                );
                setError('Не удалось изменить роль. Повторите попытку.');
            }
        },
        [users],
    );

    return { users, isLoading, error, updateRole };
};
