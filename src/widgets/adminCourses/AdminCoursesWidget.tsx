'use client';

import { Alert, Card, Loader } from '@gravity-ui/uikit';
import { useMemo, useState } from 'react';

import { useCourses } from '@/entities/adminCourses';
import { DeleteCourseConfirmModal } from '@/entities/modals/DeleteCourseConfirm';
import { CoursesTable } from '@/features/courses';

export function AdminCoursesWidget() {
    const { courses, isLoading, error, deleteCourse } = useCourses();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editId, setEditId] = useState<number | null>(null);
    const deletingCourse = useMemo(
        () => courses.find((c) => c.id === deleteId),
        [courses, deleteId],
    );
    const editingCourse = useMemo(
        () => courses.find((c) => c.id === editId),
        [courses, editId],
    );

    if (isLoading) return <Loader />;

    return (
        <Card>
            {error && <Alert title="Ошибка" message={error} theme="danger" />}

            <CoursesTable
                courses={courses}
                onDeleteAction={setDeleteId}
                onEditAction={setEditId}
            />

            <DeleteCourseConfirmModal
                isOpen={deleteId !== null}
                courseTitle={deletingCourse?.title}
                onCloseAction={() => setDeleteId(null)}
                onConfirmAction={async () => {
                    if (deleteId) {
                        await deleteCourse(deleteId);
                        setDeleteId(null);
                    }
                }}
            />

            <DeleteCourseConfirmModal
                isOpen={editId !== null}
                courseTitle={'редактирование курса'}
                onCloseAction={() => setEditId(null)}
                onConfirmAction={async () => {
                    if (editId) {
                        await deleteCourse(editId);
                        setEditId(null);
                    }
                }}
            />
        </Card>
    );
}
