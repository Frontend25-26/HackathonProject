'use client';

import { useState } from 'react';

import { deleteCourse } from '@/entities/adminCourses/api/';
import { ApiError } from '@/shared/api';

interface UseCoursesResult {
    isDeleting: boolean;
    error: string | null;
    deleteCourse: (id: number) => Promise<void>;
}

export const useCourses = (
    onDeleteAction?: (id: number) => void,
): UseCoursesResult => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteCourseHandler = async (id: number): Promise<void> => {
        setIsDeleting(true);
        setError(null);
        try {
            await deleteCourse(id);
            onDeleteAction?.(id);
        } catch (e) {
            setError(
                e instanceof ApiError ? e.message : 'Ошибка удаления курса',
            );
            throw e;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        isDeleting,
        error,
        deleteCourse: deleteCourseHandler,
    };
};
