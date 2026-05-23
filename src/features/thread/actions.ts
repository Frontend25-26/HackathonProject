import { Comment, Thread } from '@/entities/thread';

import { createReply, createThread } from './api';
import { CreateThreadActionInput } from './types';

export const handleSubmitAction = async ({
    filePath,
    line,
    reviewId,
    text,
    userId,
}: CreateThreadActionInput): Promise<[Thread, Comment]> => {
    const thread = await createThread({
        filePath,
        line,
        reviewId,
    });

    const comment = await createReply({
        body: text,
        threadId: thread.id,
        authorId: userId,
    });

    return [thread, comment];
};

export const handleReplyAction = createReply;
