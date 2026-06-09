'use client';

import { Card, Text, Box, Table } from '@gravity-ui/uikit';

import styles from './Profile.module.css';

import type { User } from '@/shared/types/user';

interface MentorSectionProps {
    students: (User & { courseName: string })[];
}

type StudentWithCourse = User & { courseName: string };

export const MentorSection = ({ students }: MentorSectionProps) => (
    <Card className={styles.card}>
        <Text as="h2" variant="subheader-2" className={styles.sectionTitle}>
            Мои студенты
        </Text>
        <Box className={styles.tableWrapper}>
            <Table
                data={students}
                columns={[
                    {
                        id: 'name',
                        name: 'Студент',
                        template: (s: StudentWithCourse) => s.name || s.login,
                    },
                    {
                        id: 'courseName',
                        name: 'Курс',
                        template: (s: StudentWithCourse) => s.courseName,
                    },
                ]}
                emptyMessage="Нет курируемых студентов"
            />
        </Box>
    </Card>
);
