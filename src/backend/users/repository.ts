import { Role } from '@backend/generated/prisma'

import { prisma } from '@backend/lib/prisma'

export const userRepository = {
    findAll() {
        return prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    },

    findById(id: number) {
        return prisma.user.findUnique({ where: { id } })
    },

    findByGithubId(githubId: number) {
        return prisma.user.findUnique({ where: { githubId } })
    },

    create(data: {
        githubId: number
        login: string
        name?: string
        email?: string
        avatar?: string
        role?: Role
    }) {
        return prisma.user.create({ data })
    },

    update(
        id: number,
        data: { name?: string; email?: string; avatar?: string; role?: Role },
    ) {
        return prisma.user.update({ where: { id }, data })
    },
}
