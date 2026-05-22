'use client';

import { User, Box } from '@gravity-ui/uikit';
import { FC } from 'react';

import { Author } from '@/features/thread/types';
import { MarkdownRender } from '@/shared/ui/MarkdownRender';

import styles from './Thread.module.css';

interface ThreadMessageProps {
    author: Author;
    createdAt: string;
    text: string;
}

export const ThreadMessage: FC<ThreadMessageProps> = ({
    author,
    createdAt,
    text,
}) => {
    const userName = author.name ?? author.login;
    return (
        <Box className={styles.message}>
            <User
                avatar={author.avatar ? author.avatar : userName}
                name={userName}
                description={createdAt}
                size="m"
            ></User>
            <MarkdownRender content={text} />
        </Box>
    );
};
