export interface CreateThreadInput {
    filePath: string;
    line: number;
    reviewId: number;
}

export interface CreateReplyInput {
    threadId: number;
    body: string;
    authorId: number;
}
