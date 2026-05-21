'use client';

import { Course } from '@/entities/course';
import { apiFetch } from '@/shared/api';

export const fetchCourses = async (): Promise<Course[]> => {
    return await apiFetch<Course[]>('/api/courses', { method: 'GET' });
};

export const deleteCourse = async (id: number): Promise<void> => {
    await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
};
