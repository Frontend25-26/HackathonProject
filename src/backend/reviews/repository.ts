import { prisma } from '@backend/lib/prisma';
import { Review } from '@backend/generated/prisma';

class ReviewRepository {
    async findAll(filters?: { submissionId?: number }): Promise<Review[]> {
        return prisma.review.findMany({
            where: filters?.submissionId
                ? { submissionId: filters.submissionId }
                : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: number): Promise<Review | null> {
        return prisma.review.findUnique({ where: { id } });
    }

    async findBySubmissionId(submissionId: number): Promise<Review | null> {
        return prisma.review.findUnique({ where: { submissionId } });
    }

    async create(data: {
        grade: number;
        generalComment?: string;
        submissionId: number;
        mentorId: number;
    }): Promise<Review> {
        return prisma.review.create({ data });
    }

    async update(
        id: number,
        data: { grade?: number; generalComment?: string },
    ): Promise<Review> {
        return prisma.review.update({ where: { id }, data });
    }
}

export const reviewRepository = new ReviewRepository();
