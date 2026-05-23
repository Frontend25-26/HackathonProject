import { create } from 'zustand';

import { ThreadWithComments, Thread, Comment } from '../types';

interface ThreadStore {
    threads: Record<number, ThreadWithComments>;
    setThreads: (threads: Thread[]) => void;
    setComments: (comments: Comment[]) => void;
    addComment: (comment: Comment) => void;
    addThread: (threads: Thread) => void;
}

export const useThread = create<ThreadStore>((set) => ({
    threads: {},
    setThreads: (threads) =>
        set({
            threads: Object.fromEntries(
                threads.map((t) => [t.id, { ...t, comments: [] }]),
            ),
        }),

    setComments: (comments) =>
        set((state) => {
            const updated = { ...state.threads };

            for (const comment of comments) {
                const thread = updated[comment.threadId];
                if (thread) {
                    updated[comment.threadId] = {
                        ...thread,
                        comments: [...thread.comments, comment],
                    };
                }
            }

            return { threads: updated };
        }),

    addThread: (thread) =>
        set((state) => ({
            threads: {
                ...state.threads,
                [thread.id]: { ...thread, comments: [] },
            },
        })),

    addComment: (comment) =>
        set((state) => {
            const thread = state.threads[comment.threadId];
            if (!thread) return state;

            return {
                threads: {
                    ...state.threads,
                    [thread.id]: {
                        ...thread,
                        comments: [...thread.comments, comment],
                    },
                },
            };
        }),
}));
