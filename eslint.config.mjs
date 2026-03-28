import { defineConfig } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import importPlugins from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

import eslintignore from './eslintignore.mjs'

export default defineConfig([
    eslintignore,
    ...nextCoreWebVitals,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,mdx}'],
        plugins: {
            import: importPlugins,
        },
        rules: {
            semi: ['error', 'never'],
            'import/order': [
                'error',
                {
                    'newlines-between': 'always',
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type',
                    ],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'import/newline-after-import': ['error', { count: 1 }],
            'sort-imports': 'off',
        },
        settings: {
            'import/resolver': {
                typescript: true,
            },
        },
    },
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
])
