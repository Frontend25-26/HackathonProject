import GitHub from 'next-auth/providers/github'

import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    providers: [GitHub],
    session: { strategy: 'jwt' as const },
    callbacks: {
        session({ session, token }) {
            if (token.userId != null) {
                session.user.userId = token.userId as number
            }
            if (token.role != null) {
                session.user.role = token.role as string
            }
            if (token.githubId != null) {
                session.user.githubId = token.githubId as number
            }
            return session
        },
    },
} satisfies NextAuthConfig
