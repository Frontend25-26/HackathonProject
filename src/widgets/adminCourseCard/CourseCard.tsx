'use client';

import {
    Text,
    Card,
    Button,
    TabProvider,
    TabList,
    Tab,
    TabPanel,
} from '@gravity-ui/uikit';
import Link from 'next/link';
import { FC, useState } from 'react';

import { useCourseAssignments } from '@/entities/assignment';
import { useCourseEnrollments } from '@/entities/courseEnrollment';
import { CourseAssignmentsWidget } from '@/widgets/courseAssignments';
import { CourseStudentsWidget } from '@/widgets/courseEnrollment';

import styles from './CourseCard.module.css';

interface CourseCardProps {
    readonly courseId: number;
}

export const CourseCard: FC<CourseCardProps> = ({ courseId }) => {
    const [activeTab, setActiveTab] = useState<string>('Домашние задания');

    const {
        course,
        assignments,
        isLoadingAssignments,
        error: assignmentsError,
        isNotFound,
    } = useCourseAssignments(courseId);

    const {
        students,
        allMentors,
        isLoadingEnrollments,
        error: enrollmentsError,
        assignMentor,
    } = useCourseEnrollments(courseId);

    if (isNotFound) {
        return (
            <div className={styles.notFoundContainer}>
                <Card view="raised" className={styles.notFoundCard}>
                    <Text variant="header-1" className={styles.notFoundTitle}>
                        Курс не найден
                    </Text>
                    <Text
                        variant="body-2"
                        className={styles.notFoundDescription}
                    >
                        Курс с идентификатором{' '}
                        <code className={styles.codeSnippet}>{courseId}</code>{' '}
                        не существует или был удалён.
                    </Text>
                    <Link href="/admin/courses">
                        <Button view="action" size="l">
                            Вернуться к списку курсов
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <TabProvider
                value={activeTab}
                onUpdate={(value: string) => setActiveTab(value)}
            >
                <TabList className={styles.tabList}>
                    <Tab
                        id="assignments"
                        value="Домашние задания"
                        className={styles.tabListText}
                    />
                    <Tab
                        id="students"
                        value="Студенты и менторы"
                        className={styles.tabListText}
                    />
                </TabList>

                <TabPanel value="Домашние задания">
                    <CourseAssignmentsWidget
                        course={course}
                        assignments={assignments}
                        isLoading={isLoadingAssignments}
                        error={assignmentsError}
                    />
                </TabPanel>

                <TabPanel value="Студенты и менторы">
                    <CourseStudentsWidget
                        students={students}
                        allMentors={allMentors}
                        isLoading={isLoadingEnrollments}
                        error={enrollmentsError}
                        onAssignMentor={assignMentor}
                    />
                </TabPanel>
            </TabProvider>
        </div>
    );
};
