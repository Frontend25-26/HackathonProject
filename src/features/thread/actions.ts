'use server';
import { auth } from '@/features/auth/authSetup';
import { CreateReplyInput, CreateThreadInput } from '@/features/thread/types';
import { reviewCommentRepository } from '@backend/review-comments/repository';
import { reviewThreadRepository } from '@backend/review-threads/repository';

export async function createThreadAction({
    filePath,
    line,
    reviewId,
    text,
}: CreateThreadInput): Promise<void> {
    const thread = await reviewThreadRepository.create({
        filePath,
        line,
        reviewId,
    });

    await createReplyAction({ threadId: thread.id, text });
}

export async function createReplyAction({
    threadId,
    text,
}: CreateReplyInput): Promise<void> {
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
