import dns from 'node:dns'

import NextAuth from 'next-auth'

import { resolveRoleFromGitHubTeams } from '@backend/github/classroom'
import { userRepository } from '@backend/users/repository'

import { authConfig } from './auth.config'

dns.setDefaultResultOrder('ipv4first')

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,

        async signIn({ profile }) {
            if (!profile?.id || !profile?.login) return false

            const githubId = Number(profile.id)
            const login = profile.login as string

            const existing = await userRepository.findByGithubId(githubId)
            console.log("EXISTING ????", existing)

            if (!existing) {
                let role
                try {
                    role = await resolveRoleFromGitHubTeams(login)
                } catch {
                    // GITHUB_TOKEN не задан или нет прав — роль по умолчанию STUDENT
                }

                await userRepository.create({
                    githubId,
                    login,
                    name: (profile.name as string) || undefined,
                    email: (profile.email as string) || undefined,
                    avatar: (profile.avatar_url as string) || undefined,
                    role,
                })
            }

            return true
        },

        async jwt({ token, profile }) {
            if (profile) {
                const githubId = Number(profile.id)
                const dbUser = await userRepository.findByGithubId(githubId)
                if (dbUser) {
                    token.userId = dbUser.id
                    token.role = dbUser.role
                    token.githubId = githubId
                }
            }
            return token
        },
    },

    // pages: {
    //     signIn: '/login',
    // },
})
