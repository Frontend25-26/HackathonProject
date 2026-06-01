'use client';

import { TableColumnConfig, Text } from '@gravity-ui/uikit';

import { Table } from '@/shared/ui/Table/Table';

import styles from './StudentCourses.module.css';

import type { Course } from '../../api/types';
import type { FC } from 'react';

interface StudentCoursesProps {
    courses: Course[];
}

const columns: TableColumnConfig<Course>[] = [
    {
        id: 'title',
        name: 'Название',
    },
    {
        id: 'description',
        name: 'Описание',
        template: (item) => (
            <span className={styles.description}>
                {item.description ?? '—'}
            </span>
        ),
    },
    {
        id: 'assignmentsCompleted',
        name: 'Домашние задания',
        template: (item) =>
            `${item.assignmentsCompleted} / ${item.assignmentsTotal}`,
    },
    {
        id: 'totalScore',
        name: 'Баллы',
        template: (item) => `${item.totalScore} / ${item.maxScore}`,
    },
];

export const StudentCourses: FC<StudentCoursesProps> = ({ courses }) => {
    const handleClick = (_item: Course): void => {};

    return (
        <>
            <Text as="h1" variant="display-1">
                Список курсов
            </Text>
            <Table
                data={courses}
                columns={columns}
                verticalAlign="middle"
                onRowClick={handleClick}
                emptyMessage="Нет доступных курсов"
            />
        </>
    );
};
