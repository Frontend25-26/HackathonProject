import { apiFetch } from '@/shared/api';

import { CreateReplyInput } from './types';

export const createReply = async ({
    text,
    threadId,
    userId,
}: CreateReplyInput): Promise<Comment> => {
    return await apiFetch<Comment>('/api/review-comments', {
        method: 'POST',
        body: {
            body: text,
            threadId: threadId,
            authorId: userId,
        },
    });
};
