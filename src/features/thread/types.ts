export interface CreateThreadInput {
    filePath: string;
    line: number;
    reviewId: number;
    text: string;
}

export interface CreateReplyInput {
    threadId: number;
    text: string;
}
