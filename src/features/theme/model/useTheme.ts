import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Theme } from './types';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
}

export const useTheme = create<ThemeState>()(
    persist(
        (set) => ({
            theme: Theme.DARK,
            toggleTheme: () =>
                set(({ theme }) => ({
                    theme: theme === Theme.DARK ? Theme.LIGHT : Theme.DARK,
                })),
        }),
        { name: 'theme-storage' },
    ),
);
