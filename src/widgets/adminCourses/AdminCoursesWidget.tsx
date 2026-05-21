'use client';

import { Alert, Card, Loader } from '@gravity-ui/uikit';
import { useState } from 'react';

import { useCourses } from '@/entities/adminCourses';
import { CoursesTable, DeleteCourseConfirm } from '@/features/courses';

export function AdminCoursesWidget() {
    const { courses, isLoading, error, deleteCourse } = useCourses();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const deletingCourse = courses.find((c) => c.id === deleteId);

    if (isLoading) return <Loader />;

    return (
        <Card>
            {error && <Alert title="Ошибка" message={error} theme="danger" />}

            <CoursesTable
                courses={courses}
                onDeleteAction={setDeleteId}
                onEditAction={() => console.log('editing')}
            />

            <DeleteCourseConfirm
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
        </Card>
    );
}
