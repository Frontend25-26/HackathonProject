'use client';

import { Card } from '@gravity-ui/uikit';
import { FC } from 'react';

import { useUsers } from '@/entities/user';
import { UsersTableWidget } from '@/widgets/usersRoleTable';

import styles from './UsersPage.module.css';

interface UsersPageProps {
    readonly currentUserId: number;
}

export const UsersPage: FC<UsersPageProps> = ({ currentUserId }) => {
    const { users, isLoading, error, updateRole } = useUsers();

    return (
        <Card className={styles.cardTable}>
            <UsersTableWidget
                users={users}
                currentUserId={currentUserId}
                isLoading={isLoading}
                error={error}
                onUpdateRole={updateRole}
            />
        </Card>
    );
};
