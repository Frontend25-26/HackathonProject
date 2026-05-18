import { createReply, createThread } from './api';
import { CreateReplyActionInput, CreateThreadActionInput } from './types';

export const handleSubmitAction = async ({
    filePath,
    line,
    reviewId,
    text,
    userId,
}: CreateThreadActionInput): Promise<Comment> => {
    const thread = await createThread({
        filePath,
        line,
        reviewId,
    });

    return await createReply({
        text,
        threadId: thread.id,
        userId,
    });
};

export const handleReplyAction = async ({
    text,
    threadId,
    userId,
}: CreateReplyActionInput): Promise<Comment> => {
    return await createReply({
        text,
        threadId,
        userId,
    });
};
