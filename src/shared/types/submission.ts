import type { CIStatus } from '@/shared/types/commit';

interface StudentSchema {
    id: number;
    name: string;
    login: string;
    avatar: string;
}

export interface Submission {
    id: number;
    repoUrl: string;
    repoName: string;
    ciStatus: CIStatus;
    status: string;
    assignmentId: number;
    studentId: number;
    student: StudentSchema;
    createdAt: string;
    updatedAt: string;
}
