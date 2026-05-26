'use client';

import { useState } from 'react';

import {
    createCourse,
    deleteCourse,
    editCourse,
} from '@/entities/adminCourses/api/';
import { ApiError } from '@/shared/api';

interface UseCoursesResult {
    isDeleting: boolean;
    isEditing: boolean;
    isCreating: boolean;
    error: string | null;
    deleteCourse: (id: number) => Promise<void>;
    editCourse: (id: number, title: string) => Promise<void>;
    createCourse: (title: string) => Promise<void>;
}

type useCoursesProps = {
    onDeleteAction?: (id: number) => void;
    onEditAction?: (id: number, newTitle: string) => void;
};

export const useCourses = ({
    onDeleteAction,
    onEditAction,
}: useCoursesProps): UseCoursesResult => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
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

    const editCourseHandler = async (id: number, title: string) => {
        setIsEditing(true);
        setError(null);
        try {
            await editCourse(id, title);
            onEditAction?.(id, title);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'Ошибка изменения');
        } finally {
            setIsEditing(false);
        }
    };

    const createCourseHandler = async (title: string) => {
        setIsCreating(true);
        setError(null);
        try {
            await createCourse(title);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'Ошибка создания');
        } finally {
            setIsEditing(false);
        }
    };

    return {
        isDeleting,
        isEditing,
        isCreating,
        error,
        deleteCourse: deleteCourseHandler,
        editCourse: editCourseHandler,
        createCourse: createCourseHandler,
    };
};
