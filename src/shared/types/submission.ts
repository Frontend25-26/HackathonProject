interface StudentSchema {
    id: number;
    name: string;
    login: string;
    avatar: string;
}

export interface Submission {
    id: number;
    repoUrl: string;
    ciStatus: string;
    status: string;
    assignmentId: number;
    studentId: number;
    student: StudentSchema;
    createdAt: string;
    updatedAt: string;
}
export interface Commit {
    sha: string;
    message: string;
    authorName: string;
    committedAt: string;
    ciStatus: string;
    commitUrl?: string;
}