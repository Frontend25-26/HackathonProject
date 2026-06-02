'use client';

import { TableColumnConfig, Text, Flex, Box, Table } from '@gravity-ui/uikit';
import { useRouter } from 'next/navigation';

import styles from './StudentCourses.module.css';

import type { Course } from '@/entities/course';
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
            <Text
                variant="body-2"
                color="secondary"
                className={styles.description}
            >
                {item.description ?? '—'}
            </Text>
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
    const router = useRouter();

    const handleClick = (course: Course) => {
        router.push(`/student/assignments?courseId=${course.id}`);
    };

    return (
        <Flex direction="column">
            <Text as="h1" variant="display-1">
                Список курсов
            </Text>

            <Box className={styles.tableWrapper}>
                <Table
                    data={courses}
                    columns={columns}
                    verticalAlign="middle"
                    onRowClick={handleClick}
                    emptyMessage="Нет доступных курсов"
                />
            </Box>
        </Flex>
    );
};
