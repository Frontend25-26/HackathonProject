import { prisma } from '@backend/lib/prisma'

export const reviewCommentRepository = {
    findAll(filters?: { threadId?: number }) {
        return prisma.reviewComment.findMany({
            where: filters?.threadId
                ? { threadId: filters.threadId }
                : undefined,
            orderBy: { createdAt: 'asc' },
        })
    },

    findById(id: number) {
        return prisma.reviewComment.findUnique({ where: { id } })
    },

    create(data: { body: string; threadId: number; authorId: number }) {
        return prisma.reviewComment.create({ data })
    },

    update(id: number, data: { body: string }) {
        return prisma.reviewComment.update({ where: { id }, data })
    },

    delete(id: number) {
        return prisma.reviewComment.delete({ where: { id } })
    },
}
