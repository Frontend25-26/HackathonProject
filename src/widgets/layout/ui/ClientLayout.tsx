'use client';

import { ThemeProvider } from '@gravity-ui/uikit';
import { FC, PropsWithChildren } from 'react';

import { useTheme } from '@/features/theme';

export const ClientLayout: FC<PropsWithChildren> = ({ children }) => {
    const theme = useTheme((state) => state.theme);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
