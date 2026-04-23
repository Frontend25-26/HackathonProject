import { globalIgnores } from 'eslint/config';

export default globalIgnores([
    '**/.*/**/*', // Default of ESLint legacy config
    '**/node_modules',
    '**/.next/**/*',
    '**/_next/**/*',
    '**/.vscode/**/*',
    '**/dist/**/*',
    '.prettierignore', // Config file, not markdown
    'src/backend/generated/**/*', // Generated code
]);
