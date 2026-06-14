'use client';

import {
    Card,
    Text,
    Alert,
    Loader,
    type TableColumnConfig,
} from '@gravity-ui/uikit';
import { FC, useMemo } from 'react';

import { CourseStudentRow } from '@/entities/courseEnrollment';
import { MentorDropdown } from '@/features/mentorDropdown';
import { User } from '@/shared/types/user';
import { TableWithSorting } from '@/shared/ui/Table';

import styles from './CourseStudentsWidget.module.css';

import type { ReactNode } from 'react';

interface CourseStudentsWidgetProps {
    students: CourseStudentRow[];
    allMentors: User[];
    isLoading: boolean;
    error: string | null;
    onAssignMentor: (enrollmentId: number, mentorId: number | null) => void;
}

export const CourseStudentsWidget: FC<CourseStudentsWidgetProps> = ({
    students,
    allMentors,
    isLoading,
    error,
    onAssignMentor,
}) => {
    const CourseEnrollmentTable = TableWithSorting<CourseStudentRow>();

    const columns: TableColumnConfig<CourseStudentRow>[] = useMemo(
        (): TableColumnConfig<CourseStudentRow>[] => [
            {
                id: 'index',
                name: '№',
                width: '8%',
                align: 'center',
            },
            {
                id: 'studentName',
                name: 'Студент',
                width: '40%',
                meta: {
                    sort: (a: CourseStudentRow, b: CourseStudentRow): number =>
                        a.studentName.localeCompare(b.studentName, undefined, {
                            sensitivity: 'base',
                        }),
                },
            },
            {
                id: 'mentorName',
                name: 'Ментор',
                width: '52%',
                meta: {
                    sort: (
                        a: CourseStudentRow,
                        b: CourseStudentRow,
                    ): number => {
                        if (!a.mentorName && !b.mentorName) return 0;

                        if (!a.mentorName) return 1;

                        if (!b.mentorName) return -1;

                        return a.mentorName.localeCompare(
                            b.mentorName,
                            undefined,
                            { sensitivity: 'base' },
                        );
                    },
                },
                template: (item: CourseStudentRow): ReactNode => (
                    <div className={styles.mentorCell}>
                        <Text
                            variant="body-2"
                            color={item.mentorName ? 'primary' : 'secondary'}
                            className={styles.mentorText}
                        >
                            {item.mentorName ?? 'Не назначен'}
                        </Text>

                        <MentorDropdown
                            currentMentorId={item.mentorId}
                            mentors={allMentors}
                            onSelect={(mentorId: number | null): void =>
                                onAssignMentor(item.enrollmentId, mentorId)
                            }
                        />
                    </div>
                ),
            },
        ],
        [allMentors, onAssignMentor],
    );

    if (isLoading) {
        return <Loader size="l" className={styles.loader} />;
    }

    return (
        <div className={styles.wrapper}>
            <Card view="raised" className={styles.headerCard}>
                <Text variant="header-1" className={styles.courseTitle}>
                    Студенты курса
                </Text>
            </Card>

            {error !== null && (
                <Alert
                    theme="danger"
                    title="Ошибка"
                    message={error}
                    className={styles.alert}
                />
            )}

            <Card view="raised" className={styles.tableCard}>
                <CourseEnrollmentTable data={students} columns={columns} />
            </Card>
        </div>
    );
};
