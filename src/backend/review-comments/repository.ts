import { prisma } from '@backend/lib/prisma';
import { ReviewComment } from '@backend/generated/prisma';

class ReviewCommentsRepository {
    async findAll(filters?: { threadId?: number }): Promise<ReviewComment[]> {
        return prisma.reviewComment.findMany({
            where: filters?.threadId
                ? { threadId: filters.threadId }
                : undefined,
            orderBy: { createdAt: 'asc' },
        });
    }

    async findById(id: number): Promise<ReviewComment | null> {
        return prisma.reviewComment.findUnique({ where: { id } });
    }

    async create(data: {
        body: string;
        threadId: number;
        authorId: number;
    }): Promise<ReviewComment> {
        return prisma.reviewComment.create({ data });
    }

    async update(id: number, data: { body: string }): Promise<ReviewComment> {
        return prisma.reviewComment.update({ where: { id }, data });
    }

    async delete(id: number): Promise<ReviewComment> {
        return prisma.reviewComment.delete({ where: { id } });
    }
}

export const reviewCommentRepository = new ReviewCommentsRepository();
