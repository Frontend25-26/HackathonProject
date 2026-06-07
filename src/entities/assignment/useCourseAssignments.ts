'use client';

import { useState, useEffect } from 'react';

import { ApiError } from '@/shared/api';
import { Assignment } from '@/shared/types/assignment';
import { Course } from '@/shared/types/course';

import { fetchCourse, fetchAssignmentsByCourseId } from './api';

type UseCourseAssignmentsResult = {
    course: Course | null;
    assignments: Assignment[];
    isLoadingAssignments: boolean;
    error: string | null;
    isNotFound: boolean;
};

export const useCourseAssignments = (
    courseId: number,
): UseCourseAssignmentsResult => {
    const [course, setCourse] = useState<Course | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isLoadingAssignments, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            setIsLoading(true);
            setIsNotFound(false);
            setError(null);

            try {
                const [courseData, assignmentsData] = await Promise.all([
                    fetchCourse(courseId),
                    fetchAssignmentsByCourseId(courseId),
                ]);
                setCourse(courseData);
                setAssignments(assignmentsData);
            } catch (err: unknown) {
                const apiErr = err instanceof ApiError ? err : null;
                if (apiErr?.status === 404 || String(err).includes('404')) {
                    setIsNotFound(true);
                } else {
                    setError('Ошибка загрузки данных курса');
                }
            } finally {
                setIsLoading(false);
            }
        };

        void loadData();
    }, [courseId]);

    return { course, assignments, isLoadingAssignments, error, isNotFound };
};
