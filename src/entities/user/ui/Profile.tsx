'use client';

import { Card, Text, Flex, Box, Avatar, Link } from '@gravity-ui/uikit';

import { getRoleColor } from '../lib/getRoleColor';

import { AdminSection } from './AdminSection';
import { MentorSection } from './MentorSection';
import styles from './Profile.module.css';
import { StudentSection } from './StudentSection';

import type { Course } from '@/entities/course';
import type { User, UserRole } from '@/shared/types/user';

interface ProfileProps {
    user: User;
    courses?: Course[];
    students?: (User & { courseName: string })[];
    mentors?: User[];
}

const getRoleText = (role: UserRole): string => {
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

export const Profile = ({
    user,
    courses = [],
    students = [],
    mentors = [],
}: ProfileProps) => {
    const gitHubLink = `https://github.com/${user.login}`;
    const emailLink = user.email ? `mailto:${user.email}` : undefined;
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
                            <Link
                                href={emailLink!}
                                className={styles.emailLink}
                            >
                                Email: {user.email}
                            </Link>
                        )}
                    </Box>
                </Flex>
            </Card>

            {user.role === 'STUDENT' && <StudentSection courses={courses} />}
            {user.role === 'MENTOR' && <MentorSection students={students} />}
            {user.role === 'ADMIN' && (
                <AdminSection courses={courses} mentors={mentors} />
            )}
        </Flex>
    );
};
