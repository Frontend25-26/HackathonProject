'use client';

import { Dialog, Button } from '@gravity-ui/uikit';
import { useState } from 'react';

import { BaseConfirmModal } from './BaseConfirmModal';

type DeleteCourseConfirmProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    onConfirmAction: () => Promise<void>;
    courseTitle: string | undefined;
};

export const DeleteCourseConfirmModal = ({
    isOpen,
    onCloseAction,
    onConfirmAction,
    courseTitle,
}: DeleteCourseConfirmProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirmAction();
            onCloseAction();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseConfirmModal
            title={'Удалить курс?'}
            body={`Вы действительно хотите удалить курс ${courseTitle}?`}
            isOpen={isOpen}
            onCloseAction={onCloseAction}
            onConfirmAction={handleConfirm}
        />
    );
};
