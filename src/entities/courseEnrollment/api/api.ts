import { apiFetch } from '@/shared/api';
import { Enrollment } from '@/shared/types/enrollment';
import { User } from '@/shared/types/user';

export const fetchEnrollments = async (
    courseId: number,
): Promise<Enrollment[]> => {
    return apiFetch<Enrollment[]>(`/api/enrollments?courseId=${courseId}`);
};

export const fetchUsers = async (): Promise<User[]> => {
    return apiFetch<User[]>('/api/users');
};

export const assignMentorToEnrollment = async (
    enrollmentId: number,
    mentorId: number | null,
): Promise<void> => {
    await apiFetch<void>(`/api/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        body: { mentorId },
    });
};
