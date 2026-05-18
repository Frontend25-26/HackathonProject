'use client';

import { ThemeProvider } from '@gravity-ui/uikit';
import { SessionProvider } from 'next-auth/react';
import { FC, PropsWithChildren } from 'react';

import { useTheme } from '@/features/theme';

export const ClientLayout: FC<PropsWithChildren> = ({ children }) => {
    const theme = useTheme((state) => state.theme);

    return (
        <SessionProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </SessionProvider>
    );
};
