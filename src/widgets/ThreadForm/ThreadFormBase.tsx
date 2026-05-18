'use client';
import { Card, TextArea, Button } from '@gravity-ui/uikit';
import { FC, useState } from 'react';

import { MarkdownRender } from '@/shared/ui/MarkdownRender';

import styles from './ThreadForm.module.css';

interface ThreadFormProps {
    submitLabel: string;
    onSubmit: (text: string) => Promise<void>;
    onCancel: () => void;
}

export const ThreadFormBase: FC<ThreadFormProps> = ({
    submitLabel,
    onSubmit,
    onCancel,
}) => {
    const [text, setText] = useState('');
    const [preview, setPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
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
        <Card view="filled" className={styles['thread-form-box']}>
            <div>
                {!preview ? (
                    <TextArea
                        value={text}
                        minRows={10}
                        size="l"
                        placeholder="Введите текст..."
                        onChange={(e) => setText(e.target.value)}
                        className={styles['markdown-editor']}
                    />
                ) : (
                    <Card size="m" className={styles['markdown-preview']}>
                        {text ? (
                            <MarkdownRender content={text} />
                        ) : (
                            <span style={{ opacity: 0.5 }}>:/</span>
                        )}
                    </Card>
                )}

                <div className={styles['button-group']}>
                    <Button
                        loading={isSubmitting}
                        disabled={!text.trim() || isSubmitting}
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
