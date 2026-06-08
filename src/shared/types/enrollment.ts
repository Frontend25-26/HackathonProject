export interface Enrollment {
    id: number;
    courseId: number;
    studentId: number;
    mentorId: number | null;
    createdAt: string;
}
