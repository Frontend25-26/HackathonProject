import { DefaultSession } from 'next-auth';

import type { Role } from '@backend/generated/prisma';

declare module 'next-auth' {
    interface Session {
        user: {
            userId: number;
            role: Role;
            githubId: number;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: number;
        role?: Role;
        githubId?: number;
    }
}
