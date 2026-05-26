'use client';

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
    const handleConfirm = async () => {
        await onConfirmAction();
        onCloseAction();
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
