import { Prisma } from '@backend/generated/prisma';
import { prisma } from '@backend/lib/prisma';

const authorInclude = {
    author: {
        select: {
            id: true,
            name: true,
            login: true,
            avatar: true,
        },
    },
} as const;

type ReviewCommentWithAuthor = Prisma.ReviewCommentGetPayload<{
    include: typeof authorInclude;
}>;

class ReviewCommentsRepository {
    async findAll(filters?: {
        threadId?: number;
        threadIds?: number[];
    }): Promise<ReviewCommentWithAuthor[]> {
        return prisma.reviewComment.findMany({
            where: filters?.threadIds?.length
                ? { threadId: { in: filters.threadIds } }
                : filters?.threadId
                    ? { threadId: filters.threadId }
                    : undefined,
            include: authorInclude,
            orderBy: { createdAt: 'asc' },
        });
    }

    async findById(id: number): Promise<ReviewCommentWithAuthor | null> {
        return prisma.reviewComment.findUnique({
            where: { id },
            include: authorInclude,
        });
    }

    async findByGithubCommentId(
        githubCommentId: number,
    ): Promise<ReviewCommentWithAuthor | null> {
        return prisma.reviewComment.findFirst({
            where: { githubCommentId },
            include: authorInclude,
        });
    }

    async create(data: {
        body: string;
        threadId: number;
        authorId: number;
        githubCommentId?: number | null;
    }): Promise<ReviewCommentWithAuthor> {
        return prisma.reviewComment.create({ data, include: authorInclude });
    }

    async update(
        id: number,
        data: { body: string },
    ): Promise<ReviewCommentWithAuthor> {
        return prisma.reviewComment.update({
            where: { id },
            data,
            include: authorInclude,
        });
    }

    async delete(id: number): Promise<ReviewCommentWithAuthor> {
        return prisma.reviewComment.delete({
            where: { id },
            include: authorInclude,
        });
    }
}

export const reviewCommentRepository = new ReviewCommentsRepository();
