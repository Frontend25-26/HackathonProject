'use client';
import { useSession } from 'next-auth/react';
import { FC } from 'react';

import { useThread } from '@/entities/thread/model/useThread';
import { handleSubmitAction } from '@/features/thread/actions';

import { ThreadFormBase } from './ThreadFormBase';

interface ThreadFormCreateProps {
    filePath: string;
    line: number;
    reviewId: number;
    onCancel?: () => Promise<void>;
    onSubmit?: () => Promise<void>;
}

export const ThreadFormCreate: FC<ThreadFormCreateProps> = ({
    filePath,
    line,
    reviewId,
    onCancel,
    onSubmit,
}) => {
    const session = useSession();
    const { addThread, addComment } = useThread();

    const handleSubmit = async (text: string): Promise<void> => {
        if (!session?.data?.user.userId) {
            throw new Error('unauthorized');
        }

        const [thread, comment] = await handleSubmitAction({
            filePath,
            line,
            reviewId,
            text,
            userId: session.data.user.userId,
        });

        addThread(thread);
        addComment(comment);

        await onSubmit?.();
    };

    const handleCancel = async (): Promise<void> => {
        await onCancel?.();
    };

    return (
        <ThreadFormBase
            submitLabel="Создать тред"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
};
