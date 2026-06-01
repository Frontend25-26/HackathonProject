export interface Thread {
    id: number;
    githubThreadId: number;
    filePath: string;
    reviewId: number;
    line: number;
    createdAt: string;
}

export interface Comment {
    body: string;
    createdAt: string;
    id: number;
    threadId: number;
    updatedAt: string;
    author: Author;
}

export interface Author {
    id: number;
    name: string;
    login: string;
    avatar: string;
}

export interface ThreadWithComments extends Thread {
    comments: Comment[];
}
