export type Commit = {
    id: string;
    sha: string;
    message: string;
    authorName: string;
    authorLogin: string;
    committedAt: string;
    ciStatus: CiStatus;
    submissionId: string;
};

export enum CiStatus {
    UNKNOWN = 'UNKNOWN',
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
}
