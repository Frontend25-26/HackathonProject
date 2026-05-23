'use client';

import { User, Box } from '@gravity-ui/uikit';
import { formatDistanceToNow } from 'date-fns';
import { FC } from 'react';

import { Author } from '@/entities/thread';
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
                description={formatDistanceToNow(createdAt)}
                size="m"
            />
            <MarkdownRender content={text} />
        </Box>
    );
};
