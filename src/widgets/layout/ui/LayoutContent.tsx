'use client';

import { Box, type Theme, ThemeProvider } from '@gravity-ui/uikit';
import { FC, PropsWithChildren, useState } from 'react';

import { Sidebar } from './Sidebar';

import type { User } from '@/entities/user';

interface LayoutContentProps extends PropsWithChildren {
    user: User;
}

export const LayoutContent: FC<LayoutContentProps> = ({ user, children }) => {
    const [theme, setTheme] = useState<Theme>('dark');
    const toggleTheme = () =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <ThemeProvider theme={theme}>
            <Sidebar
                user={user}
                isDark={theme === 'dark'}
                onToggleTheme={toggleTheme}
            >
                <Box as="main" spacing={{ p: 6 }}>
                    {children}
                </Box>
            </Sidebar>
        </ThemeProvider>
    );
};
