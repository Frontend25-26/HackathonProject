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

export type CIStatus =
    | 'UNKNOWN'
    | 'PENDING'
    | 'RUNNING'
    | 'SUCCESS'
    | 'FAILURE';
