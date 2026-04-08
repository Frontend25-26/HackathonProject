import { prisma } from '@backend/lib/prisma'

export const reviewRepository = {
    findAll(filters?: { submissionId?: number }) {
        return prisma.review.findMany({
            where: filters?.submissionId
                ? { submissionId: filters.submissionId }
                : undefined,
            orderBy: { createdAt: 'desc' },
        })
    },

    findById(id: number) {
        return prisma.review.findUnique({ where: { id } })
    },

    findBySubmissionId(submissionId: number) {
        return prisma.review.findUnique({ where: { submissionId } })
    },

    create(data: {
        grade: number
        generalComment?: string
        submissionId: number
        mentorId: number
    }) {
        return prisma.review.create({ data })
    },

    update(id: number, data: { grade?: number; generalComment?: string }) {
        return prisma.review.update({ where: { id }, data })
    },
}
