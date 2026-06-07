export interface Assignment {
    classroomUrl: string;
    courseId: number;
    createdAt: string;
    createdById: number;
    description: string;
    dueDate: string;
    id: number;
    maxGrade: number;
    title: string;
    updatedAt: string;
    inviteLink?: string;
    totalScore: number;
}
export enum AssignmentStatus {
    ACTIVE = 'active',
    OVERDUE = 'overdue',
    COMPLETED = 'completed',
}
