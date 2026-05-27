'use client';

import { Dialog, Button, TextInput } from '@gravity-ui/uikit';
import { FC, useState } from 'react';

type EditCourseModalProps = {
    isOpen: boolean;
    initialTitle: string | undefined;
    onCloseAction: () => void;
    onConfirmAction: (title: string) => Promise<void>;
};

export const EditCourseModal: FC<EditCourseModalProps> = ({
    isOpen,
    initialTitle,
    onCloseAction,
    onConfirmAction,
}) => {
    const [title, setTitle] = useState<string>(
        initialTitle ? initialTitle : 'Название курса',
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async (): Promise<void> => {
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
        }
    };

    return (
        <Dialog open={isOpen} onClose={onCloseAction} hasCloseButton>
            <Dialog.Header caption="Редактировать курс" />
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
