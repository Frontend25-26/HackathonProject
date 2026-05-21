export type FilePath = string;

export type FileChange = {
    oldContent: string;
    newContent: string;
};

export type RepoDiff = Record<FilePath, FileChange>;

export const repoDiff: RepoDiff = {
    'src/sum.ts': {
        oldContent: `
export function sum(a: number, b: number) {
  return a - b;
}
console.log(sum(1, 2));
`,
        newContent: `
export function sum(a: number, b: number) {
  return a + b;
}
console.log("updated sum:", sum(1, 2));
`,
    },

    'src/multiply.ts': {
        oldContent: `
export function multiply(a: number, b: number) {
  return a * b;
}
`,
        newContent: `
export function multiply(a: number, b: number) {
  const result = a * b;
  return result;
}

export function multiply(a: number, b: number) {
  const result = a * b;
  return result;
}

export function multiply(a: number, b: number) {
  const result = a * b;
  return result;
}

export function multiply(a: number, b: number) {
  const result = a * b;
  return result;
}

export function multiply(a: number, b: number) {
  const result = a * b;
  return result;
}

export function multiply(a: number, b: number) {
  const result = a * b;
  return result;
}

export function multiply(a: number, b: number) {
  const result = a * b;
  return result;
}
`,
    },

    'src/divide.ts': {
        oldContent: '',
        newContent: `
export function divide(a: number, b: number) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}
`,
    },

    'src/entities/types.ts': {
        oldContent: `
export type Props = {
  a: number;
  b: number;
};
`,
        newContent: `
export type Props = {
  a: number;
  b: number;
  debug?: boolean;
};
`,
    },

    'src/utils/math.ts': {
        oldContent: `
export const PI = 3.14;
`,
        newContent: `
export const PI = 3.14159;
`,
    },

    'src/utils/random.ts': {
        oldContent: `
export const random = () => Math.random();
`,
        newContent: `
export const random = () => {
  return Math.random();
};
`,
    },

    'src/logger.ts': {
        oldContent: `
console.log("logger");
`,
        newContent: `
console.info("logger initialized");
`,
    },

    'src/constants.ts': {
        oldContent: `
export const APP_NAME = "Demo";
`,
        newContent: `
export const APP_NAME = "Demo App";
`,
    },

    'src/hooks/useToggle.ts': {
        oldContent: `
export const useToggle = () => false;
`,
        newContent: `
export const useToggle = () => true;
`,
    },

    'src/hooks/useUser.ts': {
        oldContent: '',
        newContent: `
export const useUser = () => {
  return { name: "John" };
};
`,
    },

    'src/components/Button.tsx': {
        oldContent: `export const Button = () => <button>Click</button>;`,
        newContent: `export const Button = () => <button>Submit</button>;`,
    },

    'src/components/ui/Card.tsx': {
        oldContent: `export const Card = () => <div>Card</div>;`,
        newContent: `export const Card = () => <div className="card">Card</div>;`,
    },

    'src/styles/main.css': {
        oldContent: `body { background: white; }`,
        newContent: `body { background: #f5f5f5; }`,
    },

    'src/styles/components/button.scss': {
        oldContent: `.btn { padding: 4px; }`,
        newContent: `.btn { padding: 8px; border-radius: 6px; }`,
    },

    'server/index.ts': {
        oldContent: `console.log("server v1");`,
        newContent: `console.log("server v2");`,
    },

    'server/routes/auth/login.ts': {
        oldContent: `export const login = () => {};`,
        newContent: `export const login = (req: any) => { return req.user; };`,
    },

    'server/routes/auth/register.ts': {
        oldContent: `export const register = () => {};`,
        newContent: `export const register = (req: any) => { return true; };`,
    },

    'config/env/dev.json': {
        oldContent: `{"api": "http://localhost"}`,
        newContent: `{"api": "http://localhost:3000"}`,
    },

    'config/env/prod.json': {
        oldContent: `{"api": "https://api.old.com"}`,
        newContent: `{"api": "https://api.new.com"}`,
    },

    'config/docker/Dockerfile': {
        oldContent: `FROM node:18`,
        newContent: `FROM node:20`,
    },

    'public/index.html': {
        oldContent: `<html><body><h1>Hello</h1></body></html>`,
        newContent: `<html><body><h1>Hello Diff</h1></body></html>`,
    },

    'src/features/auth/ui/LoginForm.tsx': {
        oldContent: `export const LoginForm = () => <form>Login</form>;`,
        newContent: `export const LoginForm = () => <form>Sign in</form>;`,
    },

    'src/features/auth/api/login.ts': {
        oldContent: `export const apiLogin = () => {};`,
        newContent: `export const apiLogin = async () => {};`,
    },

    'src/features/auth/model/authStore.ts': {
        oldContent: `export const auth = {};`,
        newContent: `export const auth = { user: null };`,
    },
};
