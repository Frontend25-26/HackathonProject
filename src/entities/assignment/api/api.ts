import { apiFetch } from '@/shared/api';
import { Assignment } from '@/shared/types/assignment';
import { Course } from '@/shared/types/course';

export const fetchCourse = async (courseId: number): Promise<Course> => {
    return apiFetch<Course>(`/api/courses/${courseId}`);
};

export const fetchAssignmentsByCourseId = async (
    courseId: number,
): Promise<Assignment[]> => {
    return apiFetch<Assignment[]>(`/api/assignments?courseId=${courseId}`);
};
