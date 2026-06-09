'use client';

import { Card, Text, Flex, Box, Avatar, Link, Table } from '@gravity-ui/uikit';

import styles from './Profile.module.css';

import type { Course } from '@/entities/course';
import type { User, UserRole } from '@/shared/types/user';

interface ProfileProps {
    user: User;
    courses: Course[];
    students: (User & { courseName: string })[];
}

const getRoleColor = (role: UserRole) => {
    switch (role) {
        case 'STUDENT':
            return 'var(--g-color-text-positive)';
        case 'MENTOR':
            return 'var(--g-color-text-warning)';
        case 'ADMIN':
            return 'var(--g-color-text-danger)';
        default:
            return 'var(--g-color-text-secondary)';
    }
};

const getRoleText = (role: UserRole) => {
    switch (role) {
        case 'STUDENT':
            return 'Студент';
        case 'MENTOR':
            return 'Ментор';
        case 'ADMIN':
            return 'Администратор';
        default:
            return role;
    }
};

export const Profile = ({ user, courses, students }: ProfileProps) => {
    const gitHubLink = `https://github.com/${user.login}`;
    const userName = user.name ?? user.login;

    return (
        <Flex direction="column" gap={6} className={styles.page}>
            <Card className={styles.card}>
                <Flex gap={6} alignItems="center" className={styles.header}>
                    {user.avatar ? (
                        <Avatar
                            imgUrl={user.avatar}
                            size="xl"
                            borderColor={getRoleColor(user.role)}
                        />
                    ) : (
                        <Avatar
                            text={userName}
                            size="xl"
                            theme="brand"
                            borderColor={getRoleColor(user.role)}
                        />
                    )}
                    <Box>
                        <Text as="h1" variant="display-1">
                            {userName}
                        </Text>
                        <Text variant="body-2" color="secondary">
                            {getRoleText(user.role)}
                        </Text>
                        <Link
                            href={gitHubLink}
                            target="_blank"
                            className={styles.githubLink}
                        >
                            GitHub: {user.login}
                        </Link>
                        {user.email && (
                            <Text variant="body-2">Email: {user.email}</Text>
                        )}
                    </Box>
                </Flex>
            </Card>

            {user.role === 'STUDENT' && (
                <Card className={styles.card}>
                    <Text
                        as="h2"
                        variant="subheader-2"
                        className={styles.sectionTitle}
                    >
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
                                    name: 'Прогресс',
                                    template: (c: Course) =>
                                        `${c.assignmentsCompleted} / ${c.assignmentsTotal} ДЗ`,
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
            )}

            {user.role === 'MENTOR' && (
                <Card className={styles.card}>
                    <Text
                        as="h2"
                        variant="subheader-2"
                        className={styles.sectionTitle}
                    >
                        Мои студенты
                    </Text>
                    <Box className={styles.tableWrapper}>
                        <Table
                            data={students}
                            columns={[
                                {
                                    id: 'name',
                                    name: 'Студент',
                                    template: (
                                        s: User & { courseName: string },
                                    ) => s.name || s.login,
                                },
                                {
                                    id: 'courseName',
                                    name: 'Курс',
                                    template: (
                                        s: User & { courseName: string },
                                    ) => s.courseName,
                                },
                            ]}
                            emptyMessage="Нет курируемых студентов"
                        />
                    </Box>
                </Card>
            )}
        </Flex>
    );
};
