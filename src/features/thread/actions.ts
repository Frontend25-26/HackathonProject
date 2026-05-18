'use server';
import { auth } from '@/features/auth/authSetup';
import { reviewCommentRepository } from '@backend/review-comments/repository';
import { reviewThreadRepository } from '@backend/review-threads/repository';

interface CreateThreadInput {
    filePath: string;
    line: number;
    reviewId: number;
    text: string;
}

interface CreateReplyInput {
    threadId: number;
    text: string;
}

export async function createThreadAction({
    filePath,
    line,
    reviewId,
    text,
}: CreateThreadInput) {
    const thread = await reviewThreadRepository.create({
        filePath,
        line,
        reviewId,
    });

    await createReplyAction({ threadId: thread.id, text });
}

export async function createReplyAction({ threadId, text }: CreateReplyInput) {
    const session = await auth();

    if (!session?.user.userId) {
        throw new Error('unauthorized');
    }

    await reviewCommentRepository.create({
        body: text,
        threadId: threadId,
        authorId: session.user.userId,
    });
}
