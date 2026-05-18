'use client';
import { Card, TextArea, Button } from '@gravity-ui/uikit';
import { FC, useMemo, useState } from 'react';

import { MarkdownRender } from '@/shared/ui/MarkdownRender';

import styles from './ThreadForm.module.css';

interface ThreadFormBaseProps {
    submitLabel: string;
    onSubmit: (text: string) => Promise<void>;
    onCancel: () => void;
}

export const ThreadFormBase: FC<ThreadFormBaseProps> = ({
    submitLabel,
    onSubmit,
    onCancel,
}) => {
    const [text, setText] = useState('');
    const [preview, setPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isDisabled = useMemo(
        () => !text.trim() || isSubmitting,
        [text, isSubmitting],
    );

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);

        try {
            await onSubmit(text);
            setText('');
            onCancel();
        } catch (error) {
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card view="filled" className={styles.threadFormBox}>
            <div>
                <div>
                    {preview ? (
                        <Card size="m" className={styles.markdownPreview}>
                            {text ? (
                                <MarkdownRender content={text} />
                            ) : (
                                <span className={styles.markdownDummy}>:/</span>
                            )}
                        </Card>
                    ) : (
                        <TextArea
                            value={text}
                            minRows={10}
                            size="l"
                            placeholder="Введите текст..."
                            onChange={(e) => setText(e.target.value)}
                            className={styles.markdownEditor}
                        />
                    )}
                </div>

                <div className={styles.buttonGroup}>
                    <Button
                        loading={isSubmitting}
                        disabled={isDisabled}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'Отправка...' : submitLabel}
                    </Button>

                    <Button view="outlined" onClick={onCancel}>
                        Отменить
                    </Button>

                    <Button
                        view="outlined"
                        onClick={() => setPreview((prev) => !prev)}
                    >
                        {preview ? 'Редактировать' : 'Превью'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};
