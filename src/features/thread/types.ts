import { CreateReplyInput } from './api/types';

export interface CreateThreadActionInput {
    filePath: string;
    line: number;
    reviewId: number;
    text: string;
    userId: number;
}

export type CreateReplyActionInput = CreateReplyInput;
