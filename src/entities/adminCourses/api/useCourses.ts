'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { deleteCourse, fetchCourses } from '@/entities/adminCourses/api/api';
import { Course } from '@/entities/course';
import { ApiError } from '@/shared/api';

interface UseCoursesResult {
    courses: Course[];
    isLoading: boolean;
    isDeleting: boolean;
    error: string | null;
    loadCourses: () => Promise<void>;
    deleteCourse: (id: number) => Promise<void>;
}

export const useCourses = (): UseCoursesResult => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();

    const isAuthorized = status === 'authenticated' && !!session?.user?.userId;

    const loadCourses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchCourses();
            setCourses(data);
        } catch (e) {
            setError(
                e instanceof ApiError ? e.message : 'Ошибка загрузки курсов',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCourseHandler = async (id: number) => {
        setIsDeleting(true);
        setError(null);
        try {
            await deleteCourse(id);
            await loadCourses();
        } catch (e) {
            setError(
                e instanceof ApiError ? e.message : 'Ошибка удаления курса',
            );
            throw e;
        } finally {
            setIsDeleting(false);
        }
    };

    // useEffect(() => {
    //     if (status === 'loading') return;

    //     if (!isAuthorized) {
    //         throw new Error('unauthorized');
    //     }

    //     void loadCourses();
    // }, [status, isAuthorized]);

    return {
        courses,
        isLoading,
        isDeleting,
        error,
        loadCourses,
        deleteCourse: deleteCourseHandler,
    };
};
