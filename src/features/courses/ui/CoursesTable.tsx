'use client';

import { DropdownMenu, Table, TableColumnConfig } from '@gravity-ui/uikit';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Course } from '@/entities/course';
import { formatDateFromISODate } from '@/shared/utils/helpers';

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
    const router = useRouter();

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
        {
            id: 'title',
            name: 'Название',
            template: (item) => (
                <div
                    className={styles.link_to_course}
                    onClick={() => router.push(`/admin/courses/${item.id}`)}
                >
                    {item.title}
                </div>
            ),
        },
        {
            id: 'createdAt',
            name: 'Создан',
            template: (item) => formatDateFromISODate(item.createdAt),
        },
        {
            id: 'updatedAt',
            name: 'Последнее обновление',
            template: (item) => formatDateFromISODate(item.updatedAt),
        },
        {
            id: 'actions',
            template: (item) => <DropdownMenu items={getRowActions(item)} />,
        },
    ];

    return (
        <Table
            width="max"
            data={courses}
            columns={columns}
            className={styles.table}
        />
    );
};
