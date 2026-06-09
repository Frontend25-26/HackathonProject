'use client';

import { FooterItem } from '@gravity-ui/navigation';
import { FC } from 'react';

import { getRoleColor } from '@/entities/user';
import { UserAvatar } from '@/shared/components/UserAvatar';

import type { User } from '@/entities/user';

interface UserFooterItemProps {
    user: User;
    compact: boolean;
}

export const UserFooterItem: FC<UserFooterItemProps> = ({ user, compact }) => {
    const userName = user.name ?? user.login;
    return (
        <FooterItem
            id="user"
            compact={compact}
            title={userName}
            href={`/profile`}
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
