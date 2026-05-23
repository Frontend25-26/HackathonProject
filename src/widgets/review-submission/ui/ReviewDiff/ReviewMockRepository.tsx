export type FilePath = string;

export type FileChange = {
    status: string;
    patch: string;
};

export type RepoDiff = Record<FilePath, FileChange>;

export const repoDiff = {
    'src/sum.ts': {
        status: 'modified',
        patch: `@@ -1,4 +1,4 @@
 export function sum(a: number, b: number) {
-  return a - b;
+  return a + b;
 }
-console.log(sum(1, 2));
+console.log("updated sum:", sum(1, 2));
`,
    },

    'src/multiply.ts': {
        status: 'modified',
        patch: `
@@ -1,3 +1,8 @@
 export function multiply(a: number, b: number) {
-  return a * b;
+  const result = a * b;
+  return result;
 }
+
+export const multiplyMany = (items: number[]) => {
+  return items.reduce((acc, item) => acc * item, 1);
+};
`,
    },

    'src/entities/types.ts': {
        status: 'modified',
        patch: `
@@ -1,4 +1,5 @@
 export type Props = {
   a: number;
   b: number;
+  debug?: boolean;
 };
`,
    },

    'src/utils/random.ts': {
        status: 'modified',
        patch: `
@@ -1 +1,3 @@
-export const random = () => Math.random();
+export const random = () => {
+  return Math.random();
+};
`,
    },

    'src/components/Button.tsx': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-export const Button = () => <button>Click</button>;
+export const Button = () => <button>Submit</button>;
`,
    },

    'src/components/ui/Card.tsx': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-export const Card = () => <div>Card</div>;
+export const Card = () => <div className="card">Card</div>;
`,
    },

    'src/styles/components/button.scss': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-.btn { padding: 4px; }
+.btn { padding: 8px; border-radius: 6px; }
`,
    },

    'src/features/auth/ui/LoginForm.tsx': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-export const LoginForm = () => <form>Login</form>;
+export const LoginForm = () => <form>Sign in</form>;
`,
    },

    'src/features/auth/api/login.ts': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-export const apiLogin = () => {};
+export const apiLogin = async () => {};
`,
    },

    'src/features/auth/model/authStore.ts': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-export const auth = {};
+export const auth = { user: null };
`,
    },

    'server/routes/auth/login.ts': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-export const login = () => {};
+export const login = (req: any) => { return req.user; };
`,
    },

    'config/env/prod.json': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-{"api": "https://api.old.com"}
+{"api": "https://api.new.com"}
`,
    },

    'config/docker/Dockerfile': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-FROM node:18
+FROM node:20
`,
    },

    'public/index.html': {
        status: 'modified',
        patch: `
@@ -1 +1 @@
-<html><body><h1>Hello</h1></body></html>
+<html><body><h1>Hello Diff</h1></body></html>
`,
    },

    'src/hooks/useUser.ts': {
        status: 'added',
        patch: `
@@ -0,0 +1,4 @@
+export const useUser = () => {
+  return { name: "John" };
+};
+
`,
    },

    'src/divide.ts': {
        status: 'added',
        patch: `
@@ -0,0 +1,5 @@
+export function divide(a: number, b: number) {
+  if (b === 0) throw new Error("Division by zero");
+  return a / b;
+}
+
`,
    },
};
