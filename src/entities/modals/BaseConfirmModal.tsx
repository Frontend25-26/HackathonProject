'use client';

import { Dialog, Button } from '@gravity-ui/uikit';
import { ReactNode, useState } from 'react';

type BaseConfirmProps = {
    title: string;
    body: ReactNode | string;
    isOpen: boolean;
    onCloseAction: () => void;
    onConfirmAction: () => Promise<void>;
};

export const BaseConfirmModal = ({
    title,
    body,
    isOpen,
    onCloseAction,
    onConfirmAction,
}: BaseConfirmProps) => {
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
            <Dialog.Header caption={title} />
            <Dialog.Body>{body}</Dialog.Body>
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
                    Подтвердить
                </Button>
            </Dialog.Footer>
        </Dialog>
    );
};
