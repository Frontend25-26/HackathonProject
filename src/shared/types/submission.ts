export enum CiStatus {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    RUNNING = 'RUNNING',
    PENDING = 'PENDING',
    UNKNOWN = 'UNKNOWN',
}

export type SubmissionStatus =
    | 'DRAFT'
    | 'PENDING'
    | 'IN_REVIEW'
    | 'CHANGES_REQUESTED'
    | 'APPROVED';

interface StudentSchema {
    id: number;
    name: string;
    login: string;
    avatar: string;
}

export interface Submission {
    id: number;
    repoUrl: string;
    ciStatus: CiStatus;
    status: SubmissionStatus;
    repoName: string;
    assignmentId: number;
    studentId: number;
    student: StudentSchema;
    createdAt: string;
    updatedAt: string;
    score?: number;
}

export interface Commits {
    sha: string;
    message: string;
    authorName: string;
    committedAt: string;
    ciStatus: CiStatus;
    commitUrl?: string;
}
