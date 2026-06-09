'use client';

import {
    Card,
    Text,
    Alert,
    Loader,
    Avatar,
    type TableColumnConfig,
} from '@gravity-ui/uikit';
import { FC, useMemo } from 'react';

import { UserRoleDropdown } from '@/features/userDropdown';
import { User } from '@/shared/types';
import { formatDateFromISODate } from '@/shared/utils/helpers';
import { TableWithSorting, UserTableRow } from '@/widgets/usersRoleTable/utils';

import styles from './UsersTableWidget.module.css';

import type { ReactNode } from 'react';

interface UsersTableWidgetProps {
    users: User[];
    currentUserId: number;
    isLoading: boolean;
    error: string | null;
    onUpdateRole: (userId: number, role: User['role']) => void;
}

export const UsersTableWidget: FC<UsersTableWidgetProps> = ({
    users,
    currentUserId,
    isLoading,
    error,
    onUpdateRole,
}) => {
    const tableData: UserTableRow[] = useMemo(
        () =>
            users.map((u) => {
                const displayName = u.name ?? u.login;
                const initials = displayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                return { ...u, initials };
            }),
        [users],
    );

    const columns: TableColumnConfig<UserTableRow>[] = useMemo(
        () => [
            {
                id: 'avatar',
                name: '',
                width: '50px',
                align: 'center',
                template: (item: UserTableRow) => (
                    <Avatar
                        size="m"
                        text={item.initials}
                        imgUrl={item.avatar ?? undefined}
                        theme="normal"
                    />
                ),
            },
            {
                id: 'name',
                name: 'Пользователь',
                width: '25%',
                meta: {
                    sort: (a: UserTableRow, b: UserTableRow) =>
                        (a.name ?? a.login).localeCompare(
                            b.name ?? b.login,
                            undefined,
                            { sensitivity: 'base' },
                        ),
                },
                template: (item: UserTableRow): ReactNode => (
                    <div>
                        <Text variant={'body-2'}>
                            {item.name ?? item.login}
                        </Text>
                        {item.name && (
                            <Text variant={'caption-2'} color="secondary">
                                @{item.login}
                            </Text>
                        )}
                    </div>
                ),
            },
            {
                id: 'email',
                name: 'Email',
                width: '25%',
                template: (item: UserTableRow): ReactNode => (
                    <Text color={item.email ? 'primary' : 'secondary'}>
                        {item.email ?? 'Не указан'}
                    </Text>
                ),
            },
            {
                id: 'role',
                name: 'Роль',
                width: '20%',
                meta: {
                    sort: (a: UserTableRow, b: UserTableRow) =>
                        a.role.localeCompare(b.role, undefined, {
                            sensitivity: 'base',
                        }),
                },
                template: (item: UserTableRow): ReactNode => (
                    <UserRoleDropdown
                        currentRole={item.role}
                        isDisabled={item.id === currentUserId}
                        onSelect={(newRole) => onUpdateRole(item.id, newRole)}
                    />
                ),
            },
            {
                id: 'createdAt',
                name: 'Дата регистрации',
                width: '20%',
                meta: {
                    sort: (a: UserTableRow, b: UserTableRow) =>
                        Date.parse(a.createdAt) - Date.parse(b.createdAt),
                },
                template: (item: UserTableRow) =>
                    formatDateFromISODate(item.createdAt),
            },
        ],
        [currentUserId, onUpdateRole],
    );

    if (isLoading) {
        return <Loader size="l" className={styles.loader} />;
    }

    return (
        <div className={styles.wrapper}>
            <Card view="raised" className={styles.headerCard}>
                <Text variant="header-1" className={styles.title}>
                    Пользователи платформы
                </Text>
            </Card>

            {error !== null && (
                <Alert
                    theme="danger"
                    title="Ошибка"
                    message={error}
                    className={styles.alert}
                />
            )}

            <Card view="raised" className={styles.tableCard}>
                <TableWithSorting
                    data={tableData}
                    columns={columns}
                    className={styles.table}
                />
            </Card>
        </div>
    );
};
