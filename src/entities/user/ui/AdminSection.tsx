'use client';

import { Card, Text, Box, Table } from '@gravity-ui/uikit';

import styles from './Profile.module.css';

import type { Course } from '@/entities/course';
import type { User } from '@/shared/types/user';

interface AdminSectionProps {
    courses: Course[];
    mentors: User[];
}

export const AdminSection = ({ courses, mentors }: AdminSectionProps) => (
    <>
        <Card className={styles.card}>
            <Text as="h2" variant="subheader-2" className={styles.sectionTitle}>
                Все курсы
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
                            id: 'assignmentsTotal',
                            name: 'Всего ДЗ',
                            template: (c: Course) => c.assignmentsTotal,
                        },
                        {
                            id: 'maxScore',
                            name: 'Макс. балл',
                            template: (c: Course) => c.maxScore,
                        },
                    ]}
                    emptyMessage="Нет курсов"
                />
            </Box>
        </Card>
        <Card className={styles.card}>
            <Text as="h2" variant="subheader-2" className={styles.sectionTitle}>
                Менторы
            </Text>
            <Box className={styles.tableWrapper}>
                <Table
                    data={mentors}
                    columns={[
                        {
                            id: 'name',
                            name: 'Имя',
                            template: (m: User) => m.name ?? m.login,
                        },
                        {
                            id: 'login',
                            name: 'Логин',
                            template: (m: User) => m.login,
                        },
                        {
                            id: 'email',
                            name: 'Email',
                            template: (m: User) => m.email ?? '—',
                        },
                    ]}
                    emptyMessage="Нет менторов"
                />
            </Box>
        </Card>
    </>
);
