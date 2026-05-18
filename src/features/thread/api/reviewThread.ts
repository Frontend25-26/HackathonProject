import { apiFetch } from '@/shared/api';

import { Thread } from '../types';

import { CreateThreadInput } from './types';

export const createThread = async ({
    filePath,
    line,
    reviewId,
}: CreateThreadInput): Promise<Thread> => {
    return await apiFetch<Thread>('/api/review-threads', {
        method: 'POST',
        body: {
            filePath,
            line,
            reviewId,
        },
    });
};
