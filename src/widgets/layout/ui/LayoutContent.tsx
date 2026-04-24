'use client';

import { Box } from '@gravity-ui/uikit';
import { FC, PropsWithChildren } from 'react';

import { useTheme } from '@/features/theme';

import { Sidebar } from './Sidebar';

import type { User } from '@/entities/user';

interface LayoutContentProps extends PropsWithChildren {
    user: User;
}

export const LayoutContent: FC<LayoutContentProps> = ({ user, children }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Sidebar
            user={user}
            isDark={theme === 'dark'}
            onToggleTheme={toggleTheme}
        >
            <Box as="main" spacing={{ p: 6 }}>
                {children}
            </Box>
        </Sidebar>
    );
};
