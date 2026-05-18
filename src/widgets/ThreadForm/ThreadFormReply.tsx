import { FC } from 'react';

import { createReplyAction } from '@/features/thread/actions';
import { ThreadFormBase } from '@/widgets/ThreadForm/ThreadFormBase';

interface ThreadFormReplyProps {
    threadId: number;
    onCancel: () => Promise<void>;
    onSubmit: () => Promise<void>;
}

export const ThreadFormReply: FC<ThreadFormReplyProps> = ({
    threadId,
    onCancel,
    onSubmit,
}) => {
    const handleSubmit = async (text: string): Promise<void> => {
        'use server';
        await createReplyAction({
            threadId,
            text,
        });
        await onSubmit();
    };

    const onCancelWrapper = async (): Promise<void> => {
        'use server';
        await onCancel();
    };

    return (
        <ThreadFormBase
            submitLabel="Комментировать"
            onSubmit={handleSubmit}
            onCancel={onCancelWrapper}
        />
    );
};
