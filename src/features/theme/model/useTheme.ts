import { Theme } from '@gravity-ui/uikit';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
}

export const useTheme = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark',
            toggleTheme: () =>
                set(({ theme }) => ({
                    theme: theme === 'dark' ? 'light' : 'dark',
                })),
        }),
        { name: 'theme-storage' },
    ),
);
