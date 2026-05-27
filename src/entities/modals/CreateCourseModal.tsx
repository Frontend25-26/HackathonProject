'use client';

import { Dialog, Button, TextInput } from '@gravity-ui/uikit';
import { FC, useState, useCallback } from 'react';

type CreateCourseModalProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    onConfirmAction: (title: string) => Promise<void>;
};

export const CreateCourseModal: FC<CreateCourseModalProps> = ({
    isOpen,
    onCloseAction,
    onConfirmAction,
}) => {
    const [title, setTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = useCallback(async (): Promise<void> => {
        const trimmed = title.trim();
        if (!trimmed) {
            setError('Название не может быть пустым');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await onConfirmAction(trimmed);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Ошибка при сохранении');
        } finally {
            setIsLoading(false);
            setTitle('');
        }
    }, [title, onConfirmAction]);

    return (
        <Dialog open={isOpen} onClose={onCloseAction} hasCloseButton>
            <Dialog.Header caption="Создать курс" />
            <Dialog.Body>
                <TextInput
                    value={title}
                    onChange={(t) => setTitle(t.target.value)}
                    disabled={isLoading}
                    errorMessage={error}
                    hasClear
                    autoFocus
                />
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
                    view="action"
                    onClick={handleConfirm}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Сохранить
                </Button>
            </Dialog.Footer>
        </Dialog>
    );
};
