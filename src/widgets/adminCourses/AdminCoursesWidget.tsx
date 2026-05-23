'use client';

import { Alert, Card } from '@gravity-ui/uikit';
import { FC, useMemo, useState } from 'react';

import { useCourses } from '@/entities/adminCourses';
import { Course } from '@/entities/course';
import { DeleteCourseConfirmModal } from '@/entities/modals/DeleteCourseConfirm';
import { CoursesTable } from '@/features/courses';

export const AdminCoursesWidget: FC<{ courses: Course[] }> = ({ courses }) => {
    const [data, setData] = useState(courses);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editId, setEditId] = useState<number | null>(null);
    const { error, deleteCourse } = useCourses((id: number) => {
        setData((prev) => prev.filter((course) => course.id !== id));
    });

    const deletingCourse = useMemo(
        () => data.find((c) => c.id === deleteId),
        [data, deleteId],
    );
    // const editingCourse = useMemo(
    //     () => courses.find((c) => c.id === editId),
    //     [courses, editId],
    // );

    return (
        <Card>
            {error && <Alert title="Ошибка" message={error} theme="danger" />}

            <CoursesTable
                courses={data}
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
};
