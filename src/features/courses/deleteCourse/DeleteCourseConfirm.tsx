'use client';

import { Dialog, Button } from '@gravity-ui/uikit';
import { useState } from 'react';

type Props = {
    isOpen: boolean;
    onCloseAction: () => void;
    onConfirmAction: () => Promise<void>;
    courseTitle: string | undefined;
};

export const DeleteCourseConfirm = ({
    isOpen,
    onCloseAction,
    onConfirmAction,
    courseTitle,
}: Props) => {
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
        <Dialog open={isOpen} onClose={onCloseAction} hasCloseButton>
            <Dialog.Header caption={'Удалить курс?'} />
            <Dialog.Body>
                Вы действительно хотите удалить курс <b>{courseTitle}</b>?
            </Dialog.Body>
            <Dialog.Footer>
                <Button
                    view="flat"
                    onClick={onCloseAction}
                    disabled={isLoading}
                >
                    Отмена
                </Button>
                <Button
                    view="flat-danger"
                    onClick={handleConfirm}
                    loading={isLoading}
                >
                    Удалить
                </Button>
            </Dialog.Footer>
        </Dialog>
    );
};
