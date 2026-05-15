import NextAuth from 'next-auth';

import { resolveRoleFromGitHubTeams } from '@backend/github/classroom';
import { userRepository } from '@backend/users/repository';

import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,

        async signIn({ profile, account }) {
            if (!profile?.id || !profile?.login) return false;

            const githubId = Number(profile.id);
            const login = profile.login as string;
            const accessToken = account?.access_token as string | undefined;

            const existing = await userRepository.findByGithubId(githubId);

            if (!existing) {
                let role;
                try {
                    role = await resolveRoleFromGitHubTeams(login);
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
                    githubToken: accessToken,
                });
            } else if (accessToken) {
                await userRepository.update(existing.id, {
                    githubToken: accessToken,
                });
            }

            return true;
        },

        async jwt({ token, profile }) {
            if (profile) {
                const githubId = Number(profile.id);
                const dbUser = await userRepository.findByGithubId(githubId);
                if (dbUser) {
                    token.userId = dbUser.id;
                    token.role = dbUser.role;
                    token.githubId = githubId;
                }
            }
            return token;
        },
    },

    // pages: {
    //     signIn: '/login',
    // },
});
