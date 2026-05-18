import { FC } from 'react';

import { createThreadAction } from '@/features/thread/actions';

import { ThreadFormBase } from './ThreadFormBase';

interface ThreadFormCreateProps {
    filePath: string;
    line: number;
    reviewId: number;
    onCancel: () => Promise<void>;
    onSubmit: () => Promise<void>;
}

export const ThreadFormCreate: FC<ThreadFormCreateProps> = ({
    filePath,
    line,
    reviewId,
    onCancel,
    onSubmit,
}) => {
    const handleSubmit = async (text: string) => {
        'use server';
        await createThreadAction({
            filePath,
            line,
            reviewId,
            text,
        });

        await onSubmit();
    };

    const onCancelWrapper = async () => {
        'use server';
        await onCancel();
    };

    return (
        <ThreadFormBase
            submitLabel="Создать тред"
            onSubmit={handleSubmit}
            onCancel={onCancelWrapper}
        />
    );
};
