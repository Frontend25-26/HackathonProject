import { defineConfig } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import importPlugins from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'

import eslintignore from './eslintignore.mjs'

export default defineConfig([
    eslintignore,
    ...nextCoreWebVitals,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,mdx}'],
        plugins: {
            import: importPlugins,
            boundaries: boundaries,
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
            'boundaries/element-types': [2, {
                default: 'disallow',
                rules: [
                    { from: 'app', allow: ['widgets', 'features', 'entities', 'shared'] },
                    { from: 'widgets', allow: ['features', 'entities', 'shared'] },
                    { from: 'features', allow: ['entities', 'shared'] },
                    { from: 'entities', allow: ['shared'] },
                    { from: 'shared', allow: [] },
                ]
            }],
        },
        settings: {
            'import/resolver': {
                typescript: true,
            },
            'boundaries/elements': [
                { type: 'app', pattern: 'app/*', mode: 'full' },
                { type: 'widgets', pattern: 'widgets/*', mode: 'full' },
                { type: 'features', pattern: 'features/*', mode: 'full' },
                { type: 'entities', pattern: 'entities/*', mode: 'full' },
                { type: 'shared', pattern: 'shared/*', mode: 'full' },
            ],
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