export type Commit = {
    id: string;
    sha: string;
    message: string;
    authorName: string;
    authorLogin: string;
    committedAt: string;
    ciStatus: CIStatus;
    submissionId: string;
};

export enum CIStatus {
    UNKNOWN = 'UNKNOWN',
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}
