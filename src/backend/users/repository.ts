import { Role } from '@backend/generated/prisma'
import { prisma } from '@backend/lib/prisma'

export const userRepository = {
    async findAll() {
        return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    },

    async findById(id: number) {
        return await prisma.user.findUnique({ where: { id } })
    },

    async findByGithubId(githubId: number) {
        try {
            const user = await prisma.user.findUnique({ where: { githubId } })
            return user
        } catch (error) {
            console.error(error)
            return null
        }
    },

    async create(data: {
        githubId: number
        login: string
        name?: string
        email?: string
        avatar?: string
        role?: Role
    }) {
        return await prisma.user.create({ data })
    },

    update(
        id: number,
        data: { name?: string; email?: string; avatar?: string; role?: Role },
    ) {
        return prisma.user.update({ where: { id }, data })
    },
}
