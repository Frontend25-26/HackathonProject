import { FC } from 'react';

import { createReplyAction } from '@/features/thread/actions';
import { ThreadFormBase } from '@/widgets/ThreadForm/ThreadFormBase';

interface ThreadFormReplyProps {
    threadId: number;
    onCancel: () => void;
}

export const ThreadFormReply: FC<ThreadFormReplyProps> = ({
    threadId,
    onCancel,
}) => {
    const handleSubmit = async (text: string) => {
        'use server';
        await createReplyAction({
            threadId,
            text,
        });
    };

    const onCancelWrapper = async () => {
        'use server';
        onCancel();
    };

    return (
        <ThreadFormBase
            submitLabel="Комментировать"
            onSubmit={handleSubmit}
            onCancel={onCancelWrapper}
        />
    );
};
