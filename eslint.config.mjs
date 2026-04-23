import { defineConfig } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import boundaries from 'eslint-plugin-boundaries';
import importPlugins from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

import eslintignore from './eslintignore.mjs';

export default defineConfig([
    eslintignore,
    ...nextCoreWebVitals,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,mdx}'],
        ignores: ['src/backend/**', 'src/proxy.ts'],
        plugins: {
            import: importPlugins,
            boundaries: boundaries,
        },
        rules: {
            semi: ['error', 'always'],
            'no-extra-semi': 'error',
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
            'boundaries/no-unknown-files': 'error',
            'boundaries/dependencies': [
                2,
                {
                    default: 'disallow',
                    rules: [
                        {
                            from: { type: 'app' },
                            allow: {
                                to: {
                                    type: [
                                        'widgets',
                                        'features',
                                        'entities',
                                        'shared',
                                    ],
                                },
                            },
                        },
                        {
                            from: { type: 'widgets' },
                            allow: {
                                to: {
                                    type: ['features', 'entities', 'shared'],
                                },
                            },
                        },
                        {
                            from: { type: 'features' },
                            allow: {
                                to: {
                                    type: ['entities', 'shared'],
                                },
                            },
                        },
                        {
                            from: { type: 'entities' },
                            allow: {
                                to: {
                                    type: ['shared'],
                                },
                            },
                        },
                        {
                            from: { type: 'shared' },
                            allow: {
                                to: {
                                    type: [],
                                },
                            },
                        },
                        {
                            from: { type: 'widgets' },
                            allow: {
                                to: {
                                    type: ['shared'],
                                },
                            },
                        },
                    ],
                },
            ],
        },
        settings: {
            'import/resolver': {
                typescript: true,
            },
            'boundaries/elements': [
                { type: 'app', pattern: 'src/app', mode: 'folder' },
                { type: 'widgets', pattern: 'src/widgets', mode: 'folder' },
                { type: 'features', pattern: 'src/features', mode: 'folder' },
                { type: 'entities', pattern: 'src/entities', mode: 'folder' },
                { type: 'shared', pattern: 'src/shared', mode: 'folder' },
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
]);
