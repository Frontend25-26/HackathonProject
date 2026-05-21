'use client';

import {
    DropdownMenu,
    Table,
    TableColumnConfig,
    withTableActions,
} from '@gravity-ui/uikit';
import { FC } from 'react';

import { Course } from '@/entities/course';
import { formatDate } from '@/shared/util';

import styles from './CoursesTable.module.css';

export interface CourseTableProps {
    courses: Course[];
    onEditAction: (id: number) => void;
    onDeleteAction: (id: number) => void;
}

export const CoursesTable: FC<CourseTableProps> = ({
    courses,
    onEditAction,
    onDeleteAction,
}) => {
    const getRowActions = (course: Course) => [
        {
            text: 'Редактировать',
            action: () => onEditAction(course.id),
        },
        {
            text: 'Удалить',
            action: () => onDeleteAction(course.id),
            theme: 'danger' as const,
        },
    ];

    const columns: TableColumnConfig<Course>[] = [
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
        {
            id: 'actions',
            template: (item) => <DropdownMenu items={getRowActions(item)} />,
        },
    ];

    return (
        <Table
            width={'max'}
            data={courses}
            columns={columns}
            className={styles.table}
        />
    );
};
