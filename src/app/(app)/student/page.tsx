import { FC } from 'react';

import { Comment, TestThreads } from '@/entities/thread';
import { Thread as ThreadType } from '@/entities/thread';
import { apiFetch } from '@/shared/api';
import { Thread } from '@/widgets/thread';

const StudentMainPage: FC = async () => {
    // return <h1>Hello, student!</h1>;

    const reviewId = 1;

    // const threads = await apiFetch<ThreadType[]>('/api/review-threads', {
    //     method: 'GET',
    //     query: { reviewId }
    // });

    // const thread = threads.filter((thread) => thread.id == 1).at(0);

    // if (!thread) return <div>{thread}</div>;

    // const comments = await apiFetch<Comment[]>('/api/review-comments', {
    //     method: 'GET',
    //     query: { threadIds: threads.map((t) => t.id).join(',')},
    // });

    // console.log(comments);



    // return <Thread thread={thread} comments={comments}></Thread>;
    return <TestThreads reviewId={reviewId} />;
};

export default StudentMainPage;
