"use client";
import { FC } from 'react';
import { useInitThreads } from '../../../../entities/thread/api/useInitThreads';
import { useThread } from '../../../../entities/thread/model/useThread';
import { Thread } from '@/widgets/thread';

interface TestThreadsProps {
    reviewId: number;
}

export const TestThreads: FC<TestThreadsProps> = ({ reviewId }) => {
    const { loading, error } = useInitThreads(reviewId);
    const { threads } = useThread();

    if (loading) {
        return (<p>Загрузка...</p>);
    }

    if (error) {
        return (<h3>ОШИБКА</h3>);
    }

    return <div>{Object.values(threads).map((thread) => (<Thread thread={thread}/>))}</div>;
};