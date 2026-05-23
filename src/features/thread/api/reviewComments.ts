import { Comment } from '@/entities/thread';
import { apiFetch } from '@/shared/api';

import { CreateReplyInput } from './types';

export const createReply = async (body: CreateReplyInput): Promise<Comment> => {
    return await apiFetch<Comment>('/api/review-comments', {
        method: 'POST',
        body,
    });
};
