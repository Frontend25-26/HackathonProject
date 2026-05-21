'use client';

import { Table, withTableActions } from '@gravity-ui/uikit';
import { FC } from 'react';

import { Course } from '@/entities/course';

import styles from './CoursesTable.module.css';
import { CourseTableProps, CourseColumnDef } from './types';

const ActionsTable = withTableActions<Course>(Table);

const formatDate = (date: string) => new Date(date).toLocaleDateString('ru-RU');

export const CoursesTable: FC<CourseTableProps> = ({
    courses,
    onEditAction,
    onDeleteAction,
}) => {
    const columns: CourseColumnDef[] = [
        { id: 'id', name: 'ID' },
        { id: 'title', name: 'Название' },
        {
            id: 'createdAt',
            name: 'Создан',
            template: (item) => formatDate(item.createdAt),
        },
        {
            id: 'updatedAt',
            name: 'Последнее обновление',
            template: (item) => formatDate(item.updatedAt),
        },
    ];

    const getRowActions = (course: Course) => [
        {
            text: 'Редактировать',
            handler: () => onEditAction(course.id, course.title),
        },
        {
            text: 'Удалить',
            handler: () => onDeleteAction(course.id),
            theme: 'danger' as const,
        },
    ];

    return (
        <ActionsTable
            width={'max'}
            data={courses}
            columns={columns}
            getRowActions={getRowActions}
            className={styles.table}
        />
    );
};
