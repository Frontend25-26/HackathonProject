import { Course } from '@/entities/course';
import { apiFetch } from '@/shared/api';

export const fetchCourses = async (): Promise<Course[]> => {
    return await apiFetch<Course[]>('/api/courses', { method: 'GET' });
};

export const deleteCourse = async (id: number): Promise<void> => {
    await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
};

export const editCourse = async (
    id: number,
    newTitle: string,
): Promise<Course[]> => {
    return await apiFetch<Course[]>(`/api/courses/${id}`, {
        method: 'PATCH',
        body: { title: newTitle },
    });
};

export const createCourse = async (newTitle: string): Promise<Course> => {
    return await apiFetch<Course>('/api/courses', {
        method: 'POST',
        body: { title: newTitle },
    });
};
