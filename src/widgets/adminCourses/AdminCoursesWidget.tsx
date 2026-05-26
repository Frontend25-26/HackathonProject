'use client';

import { Alert, Button, Card } from '@gravity-ui/uikit';
import { FC, useMemo, useState } from 'react';

import { useCourses } from '@/entities/adminCourses';
import { createCourse } from '@/entities/adminCourses/api';
import { Course } from '@/entities/course';
import { CreateCourseModal, EditCourseModal } from '@/entities/modals';
import { DeleteCourseConfirmModal } from '@/entities/modals/DeleteCourseConfirm';
import { CoursesTable } from '@/features/courses';

import styles from './AdminCoursesWidget.module.css';

export const AdminCoursesWidget: FC<{ courses: Course[] }> = ({ courses }) => {
    const [data, setData] = useState(courses);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [editId, setEditId] = useState<number | null>(null);
    const { error, deleteCourse, editCourse } = useCourses({
        onDeleteAction: (id: number) => {
            setData((prev) => prev.filter((course) => course.id !== id));
        },
        onEditAction: (id, newTitle) => {
            setData((prev) =>
                prev.map((c) => {
                    if (c.id === id) {
                        c.title = newTitle;
                    }
                    return c;
                }),
            );
        },
    });

    const deletingCourse = useMemo(() => {
        return data.find((c) => c.id === deleteId);
    }, [data, deleteId]);
    const editingCourse = useMemo(() => {
        return data.find((c) => c.id === editId);
    }, [data, editId]);

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

            <EditCourseModal
                key={editingCourse?.id}
                isOpen={editId !== null}
                initialTitle={editingCourse?.title}
                onCloseAction={() => setEditId(null)}
                onConfirmAction={async (newTitle) => {
                    if (editId) {
                        await editCourse(editId, newTitle);
                        setEditId(null);
                    }
                }}
            />

            <div className={styles['create-button-container']}>
                <Button
                    сlassName={styles['create-button']}
                    view="action"
                    onClick={() => setIsCreating(true)}
                >
                    + Создать курс
                </Button>
            </div>

            <CreateCourseModal
                isOpen={isCreating}
                onCloseAction={() => setIsCreating(false)}
                onConfirmAction={async (newTitle) => {
                    const createdCourse = await createCourse(newTitle);
                    setIsCreating(false);
                    setData([...data, createdCourse]);
                }}
            />
        </Card>
    );
};
