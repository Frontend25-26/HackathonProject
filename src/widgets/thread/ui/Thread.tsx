'use client';

import { Button, Card } from '@gravity-ui/uikit';
import { FC, useState } from 'react';

import { Thread as ThreadType, Comment } from '@/features/thread/types';
import { ThreadFormReply } from '@/widgets/threadForm';

import styles from './Thread.module.css';
import { ThreadMessage } from './ThreadMessage';

interface ThreadProps {
    thread: ThreadType;
    comments: Comment[];
}

export const Thread: FC<ThreadProps> = ({ thread, comments }) => {
    const [isReplying, setIsReplying] = useState(false);

    const threadComments = comments.filter(
        (comment) => comment.threadId === thread.id,
    );

    return (
        <Card view="raised" size="m" className={styles.thread}>
            <div className={styles.replies}>
                {threadComments.map((comment: Comment) => (
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
                    onCancel={async () => {
                        setIsReplying(false);
                    }}
                    onSubmit={async () => {
                        setIsReplying(false);
                    }}
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
