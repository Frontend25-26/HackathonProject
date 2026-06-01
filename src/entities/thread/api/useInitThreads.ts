'use client';

import { useEffect, useState } from 'react';

import { apiFetch } from '@/shared/api';

import { useThread } from '../model/useThread';
import { Thread, Comment } from '../types';

interface InitTreadsResult {
    loading: boolean;
    error: boolean;
}

export const useInitThreads = (reviewId: number): InitTreadsResult => {
    const { setThreads, setComments } = useThread();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const threads = await apiFetch<Thread[]>(
                    '/api/review-threads',
                    {
                        query: { reviewId },
                    },
                );

                if (threads.length == 0) return;

                setThreads(threads);

                const comments = await apiFetch<Comment[]>(
                    '/api/review-comments',
                    {
                        query: {
                            threadIds: threads.map((t) => t.id).join(','),
                        },
                    },
                );

                setComments(comments);
            } catch (_) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [reviewId, setThreads, setComments]);

    return { loading, error };
};
