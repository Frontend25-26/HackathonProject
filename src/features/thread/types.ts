import { CreateReplyInput } from './api/types';

export interface CreateThreadActionInput {
    filePath: string;
    line: number;
    reviewId: number;
    text: string;
    userId: number;
}

export type CreateReplyActionInput = CreateReplyInput;

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
