'use client';
import { Avatar } from '@gravity-ui/uikit';

import type { FC } from 'react';

interface AvatarProps {
    avatarUrl: string | null;
    name: string;
    borderColor: string;
}

export const UserAvatar: FC<AvatarProps> = ({
    avatarUrl,
    name,
    borderColor,
}) =>
    avatarUrl ? (
        <Avatar imgUrl={avatarUrl} size="m" borderColor={borderColor} />
    ) : (
        <Avatar text={name} size="m" theme="brand" borderColor={borderColor} />
    );
