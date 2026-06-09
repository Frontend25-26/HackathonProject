import type { UserRole } from '@/shared/types/user';

export const getRoleColor = (role: UserRole): string => {
    switch (role) {
        case 'STUDENT':
            return 'var(--g-color-text-positive)';
        case 'MENTOR':
            return 'var(--g-color-text-warning)';
        case 'ADMIN':
            return 'var(--g-color-text-danger)';
        default:
            return 'var(--g-color-text-secondary)';
    }
};
