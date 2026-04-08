import { prisma } from '@backend/lib/prisma'

export const reviewThreadRepository = {
    findAll(filters?: { reviewId?: number }) {
        return prisma.reviewThread.findMany({
            where: filters?.reviewId
                ? { reviewId: filters.reviewId }
                : undefined,
            orderBy: { createdAt: 'asc' },
        })
    },

    findById(id: number) {
        return prisma.reviewThread.findUnique({ where: { id } })
    },

    create(data: { filePath: string; line: number; reviewId: number }) {
        return prisma.reviewThread.create({ data })
    },

    delete(id: number) {
        return prisma.reviewThread.delete({ where: { id } })
    },
}
