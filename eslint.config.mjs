import babelParser from '@babel/eslint-parser';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugins from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

import eslintignore from './eslintignore.mjs';

export default defineConfig([
    eslintignore,
    {
        files: ['**/*.{js,jsx,mjs,ts,tsx,mts,mdx}'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            react,
            'react-hooks': reactHooks,
            import: importPlugins,
            eslintConfigPrettier,
        },
        rules: {
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
            'sort-imports': 'off', // Disable core sort-imports rule to avoid conflict
        },
        languageOptions: {
            parser: babelParser,
            ecmaVersion: 2020,
            sourceType: 'module',
            parserOptions: {
                requireConfigFile: false,
                ecmaFeatures: {
                    jsx: true,
                },
                babelOptions: {
                    presets: ['next/babel'],
                    caller: {
                        supportsTopLevelAwait: true,
                    },
                },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: true,
            },
            'import/internal-regex': '^next/',
        },
    },
    {
        files: [
            'test/**/*.js',
            'test/**/*.ts',
            'test/**/*.tsx',
            '**/*.test.ts',
            '**/*.test.tsx',
        ],
        ignores: ['test/tmp/**'],
    },
    {
        files: ['**/__tests__/**'],
    },
]);
