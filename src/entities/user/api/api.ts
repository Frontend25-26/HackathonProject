import { apiFetch } from '@/shared/api';
import { User } from '@/shared/types';
import { UserRole } from '@/shared/types/user';

export const fetchUsers = async (): Promise<User[]> => {
    return apiFetch<User[]>('/api/users');
};

export const updateUserRole = async (
    userId: number,
    role: UserRole,
): Promise<void> => {
    await apiFetch<void>(`/api/users/${userId}`, {
        method: 'PATCH',
        body: { role },
    });
};

export const fetchCurrentUser = async (): Promise<User> => {
    return apiFetch<User>('/api/me');
};
