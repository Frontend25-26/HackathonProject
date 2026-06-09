'use client';

import { Card, Text, Box, Table } from '@gravity-ui/uikit';

import styles from './Profile.module.css';

import type { Course } from '@/entities/course';

interface StudentSectionProps {
    courses: Course[];
}

export const StudentSection = ({ courses }: StudentSectionProps) => (
    <Card className={styles.card}>
        <Text as="h2" variant="subheader-2" className={styles.sectionTitle}>
            Мои курсы
        </Text>
        <Box className={styles.tableWrapper}>
            <Table
                data={courses}
                columns={[
                    {
                        id: 'title',
                        name: 'Название',
                        template: (c: Course) => c.title,
                    },
                    {
                        id: 'progress',
                        name: 'Домашние задания',
                        template: (c: Course) =>
                            `${c.assignmentsCompleted} / ${c.assignmentsTotal}`,
                    },
                    {
                        id: 'score',
                        name: 'Баллы',
                        template: (c: Course) =>
                            `${c.totalScore} / ${c.maxScore}`,
                    },
                ]}
                emptyMessage="Нет курсов"
            />
        </Box>
    </Card>
);
