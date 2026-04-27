import { prisma } from '@backend/lib/prisma';
import { ReviewThread } from '@backend/generated/prisma';

class ReviewThreadRepository {
    async findAll(filters?: { reviewId?: number }): Promise<ReviewThread[]> {
        return prisma.reviewThread.findMany({
            where: filters?.reviewId
                ? { reviewId: filters.reviewId }
                : undefined,
            orderBy: { createdAt: 'asc' },
        });
    }

    async findById(id: number): Promise<ReviewThread | null> {
        return prisma.reviewThread.findUnique({ where: { id } });
    }

    async create(data: {
        filePath: string;
        line: number;
        reviewId: number;
    }): Promise<ReviewThread> {
        return prisma.reviewThread.create({ data });
    }

    async delete(id: number): Promise<ReviewThread> {
        return prisma.reviewThread.delete({ where: { id } });
    }
}

export const reviewThreadRepository = new ReviewThreadRepository();
