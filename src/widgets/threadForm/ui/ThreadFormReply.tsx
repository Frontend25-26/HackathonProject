'use client';
import { useSession } from 'next-auth/react';
import { FC } from 'react';

import { useThread } from '@/entities/thread/model/useThread';
import { handleReplyAction } from '@/features/thread/actions';

import { ThreadFormBase } from './ThreadFormBase';

interface ThreadFormReplyProps {
    threadId: number;
    onCancel?: () => Promise<void>;
    onSubmit?: () => Promise<void>;
}

export const ThreadFormReply: FC<ThreadFormReplyProps> = ({
    threadId,
    onCancel,
    onSubmit,
}) => {
    const session = useSession();
    const { addComment } = useThread();

    const handleSubmit = async (text: string): Promise<void> => {
        if (!session?.data?.user.userId) {
            throw new Error('unauthorized');
        }

        const comment = await handleReplyAction({
            threadId,
            body: text,
            authorId: session.data.user.userId,
        });

        addComment(comment);

        await onSubmit?.();
    };

    const handleCancel = async (): Promise<void> => {
        await onCancel?.();
    };

    return (
        <ThreadFormBase
            submitLabel="Комментировать"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
};
