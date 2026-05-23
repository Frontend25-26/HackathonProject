'use client';

import { FooterItem } from '@gravity-ui/navigation';
import { Avatar } from '@gravity-ui/uikit';
import Link from 'next/link';
import { FC } from 'react';

import styles from './UserFooterItem.module.css';

import type { Role, User } from '@/entities/user';

interface UserFooterItemProps {
    user: User;
    compact: boolean;
}

const getRoleColor = (role: Role) => {
    switch (role) {
        case 'STUDENT':
            return 'var(--g-color-text-positive)';
        case 'MENTOR':
            return 'var(--g-color-text-warning)';
        case 'ADMIN':
            return 'var(--g-color-text-danger)';
    }
};

export const UserFooterItem: FC<UserFooterItemProps> = ({ user, compact }) => {
    const userName = user.name ?? user.login;
    return (
        <FooterItem
            id="user"
            compact={compact}
            title={userName}
            href={`/user/${user.id}`}
            itemWrapper={(_, makeItem) =>
                makeItem({
                    icon: user.avatar ? (
                        <Avatar
                            imgUrl={user.avatar}
                            size="m"
                            borderColor={getRoleColor(user.role)}
                        />
                    ) : (
                        <Avatar
                            text={userName}
                            size="m"
                            theme="brand"
                            borderColor={getRoleColor(user.role)}
                        />
                    ),
                    title: userName,
                })
            }
        />
    );
};
