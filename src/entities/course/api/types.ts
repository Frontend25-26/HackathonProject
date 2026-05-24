export interface Course {
    id: number;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    assignmentsTotal: number;
    assignmentsCompleted: number;
    totalScore: number;
    maxScore: number;
}
