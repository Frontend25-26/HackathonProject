import { Comment } from '@/entities/thread';

import { createReply, createThread } from './api';
import { CreateThreadActionInput } from './types';

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
        body: text,
        threadId: thread.id,
        authorId: userId,
    });
};

export const handleReplyAction = createReply;
