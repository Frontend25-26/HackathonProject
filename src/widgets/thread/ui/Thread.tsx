'use client';

import { Button, Card } from '@gravity-ui/uikit';
import { FC, useState } from 'react';

import { Comment, ThreadWithComments } from '@/entities/thread';
import { ThreadFormReply } from '@/widgets/threadForm';

import styles from './Thread.module.css';
import { ThreadMessage } from './ThreadMessage';

interface ThreadProps {
    thread: ThreadWithComments;
}

export const Thread: FC<ThreadProps> = ({ thread }) => {
    const [isReplying, setIsReplying] = useState(false);

    const handleClose = async () => setIsReplying(false);

    return (
        <Card view="raised" size="m" className={styles.thread}>
            <div className={styles.replies}>
                {thread.comments.map((comment: Comment) => (
                    <ThreadMessage
                        key={comment.id}
                        author={comment.author}
                        createdAt={comment.createdAt}
                        text={comment.body}
                    />
                ))}
            </div>
            {isReplying ? (
                <ThreadFormReply
                    threadId={thread.id}
                    onCancel={handleClose}
                    onSubmit={handleClose}
                />
            ) : (
                <Button
                    view="outlined"
                    onClick={() => setIsReplying(true)}
                    width="max"
                >
                    Ответить
                </Button>
            )}
        </Card>
    );
};
