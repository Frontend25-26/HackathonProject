import { Role } from '@prisma/client'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            userId: number
            role: Role
            githubId: number
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: number
        role?: Role
        githubId?: number
    }
}
