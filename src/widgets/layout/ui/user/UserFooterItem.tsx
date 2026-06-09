'use client';

import { FooterItem } from '@gravity-ui/navigation';
import { FC } from 'react';

import { UserAvatar } from '@/shared/components/UserAvatar';

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
                    icon: (
                        <UserAvatar
                            avatarUrl={user.avatar}
                            name={userName}
                            borderColor={getRoleColor(user.role)}
                        />
                    ),
                    title: userName,
                })
            }
        />
    );
};
