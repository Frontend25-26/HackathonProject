'use client';

import {
    Card,
    Text,
    Loader,
    Alert,
    type TableColumnConfig,
} from '@gravity-ui/uikit';
import { FC, useMemo } from 'react';

import { formatDateFromISODate } from '@/shared/utils/helpers';
import {
    AssignmentRow,
    TableWithSorting,
} from '@/widgets/courseAssignments/utils';

import styles from './CourseAssignmentsWidget.module.css';

import type { Assignment } from '@/shared/types/assignment';
import type { Course } from '@/shared/types/course';
import type { ReactNode } from 'react';

interface CourseAssignmentsWidgetProps {
    course: Course | null;
    assignments: Assignment[];
    isLoading: boolean;
    error: string | null;
}

export const CourseAssignmentsWidget: FC<CourseAssignmentsWidgetProps> = ({
    course,
    assignments,
    isLoading,
    error,
}) => {
    const tableData: AssignmentRow[] = useMemo(
        (): AssignmentRow[] =>
            assignments.map(
                (a: Assignment, idx: number): AssignmentRow => ({
                    ...a,
                    index: idx + 1,
                }),
            ),
        [assignments],
    );

    const columns: TableColumnConfig<AssignmentRow>[] = useMemo(
        (): TableColumnConfig<AssignmentRow>[] => [
            {
                id: 'index',
                name: '№',
            },
            {
                id: 'title',
                name: 'Название задания',
                meta: {
                    sort: (a: AssignmentRow, b: AssignmentRow): number =>
                        a.title.localeCompare(b.title, 'ru'),
                },
            },
            {
                id: 'dueDate',
                name: 'Дедлайн',
                meta: {
                    sort: (a: AssignmentRow, b: AssignmentRow): number => {
                        const dateA = a.dueDate
                            ? Date.parse(a.dueDate)
                            : Infinity;
                        const dateB = b.dueDate
                            ? Date.parse(b.dueDate)
                            : Infinity;
                        return dateA - dateB;
                    },
                },
                template: (item: AssignmentRow): ReactNode => {
                    if (!item.dueDate) return 'Не указан';
                    return formatDateFromISODate(item.dueDate);
                },
            },
            {
                id: 'maxGrade',
                name: 'Макс. балл',
                meta: {
                    sort: (a: AssignmentRow, b: AssignmentRow): number =>
                        a.maxGrade - b.maxGrade,
                },
            },
            {
                id: 'classroomUrl',
                name: 'Ссылка на classroom',
                template: (item) => (
                    <div
                        className={styles.link_to_course}
                        onClick={() => window.open(item.classroomUrl)}
                    >
                        {item.classroomUrl}
                    </div>
                ),
            },
        ],
        [],
    );

    if (isLoading) {
        return <Loader size="l" className={styles.loader} />;
    }

    return (
        <div className={styles.wrapper}>
            {course !== null && (
                <Card view="raised" className={styles.headerCard}>
                    <Text variant="header-1" className={styles.courseTitle}>
                        {course.title}
                    </Text>
                    <Text variant="body-2" color="secondary">
                        Создан: {formatDateFromISODate(course.createdAt)}
                    </Text>
                </Card>
            )}

            {error !== null && (
                <Alert
                    theme="danger"
                    title="Ошибка"
                    message={error}
                    className={styles.alert}
                />
            )}

            <Card view="raised" className={styles.tableCard}>
                <TableWithSorting data={tableData} columns={columns} />
            </Card>
        </div>
    );
};
