import { apiFetch } from '@/shared/api';

import { Thread } from '../types';

import { CreateThreadInput } from './types';

export const createThread = async (
    body: CreateThreadInput,
): Promise<Thread> => {
    return await apiFetch<Thread>('/api/review-threads', {
        method: 'POST',
        body,
    });
};
