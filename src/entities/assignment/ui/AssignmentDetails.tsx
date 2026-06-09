'use client';

import {
    Card,
    Text,
    Flex,
    Box,
    Label,
    TabProvider,
    TabList,
    Tab,
    TabPanel,
} from '@gravity-ui/uikit';
import { useState } from 'react';

import { MyWork } from '@/entities/submission';
import { formatDueDate } from '@/shared/utils/helpers';

import styles from './AssignmentDetails.module.css';

import type { Assignment, Submission } from '@/shared/types';

interface Props {
    assignment: Assignment;
    submission?: Submission;
}

const getAssignmentStatus = (
    assignment: Assignment,
    isCompleted?: boolean,
): { text: string; theme: 'success' | 'danger' | 'info' } => {
    if (isCompleted) return { text: 'Сдано', theme: 'success' };
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    if (dueDate < now) return { text: 'Просрочено', theme: 'danger' };
    return { text: 'Активно', theme: 'info' };
};

export const AssignmentDetails = ({ assignment, submission }: Props) => {
    const [activeTab, setActiveTab] = useState<string>('description');
    const hasSubmission = !!submission;
    const hasCommits = !!submission?.repoUrl;
    const isCompleted = submission?.status === 'APPROVED';
    const { text: statusText, theme: statusTheme } = getAssignmentStatus(
        assignment,
        isCompleted,
    );

    return (
        <Flex direction="column" gap={6} className={styles.page}>
            <Card className={styles.card}>
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    className={styles.header}
                >
                    <Text as="h1" variant="display-1">
                        {assignment.title}
                    </Text>
                    <Label theme={statusTheme}>{statusText}</Label>
                </Flex>

                <Flex gap={8} className={styles.meta}>
                    <Text>
                        <Text variant="caption-1" color="secondary">
                            Дедлайн:{' '}
                        </Text>
                        <Text variant="body-2">
                            {formatDueDate(assignment.dueDate)}
                        </Text>
                    </Text>
                    <Text>
                        <Text variant="caption-1" color="secondary">
                            Макс. балл:{' '}
                        </Text>
                        <Text variant="body-2">{assignment.maxGrade}</Text>
                    </Text>
                </Flex>

                {!hasSubmission && (
                    <Box className={styles.acceptButton}>
                        <a
                            href={assignment.inviteLink}
                            className={styles.acceptLink}
                        >
                            Принять задание
                        </a>
                    </Box>
                )}

                <TabProvider value={activeTab}>
                    <TabList onUpdate={setActiveTab} className={styles.tabs}>
                        <Tab value="description">Описание</Tab>
                        <Tab value="my-work">Моя работа</Tab>
                        <Tab value="review">Ревью</Tab>
                    </TabList>

                    <TabPanel value="description">
                        <Box className={styles.description}>
                            <Text>
                                {assignment.description || 'Нет описания'}
                            </Text>
                        </Box>
                    </TabPanel>

                    <TabPanel value="my-work">
                        <MyWork
                            assignmentId={assignment.id}
                            submission={submission}
                            hasSubmission={hasSubmission}
                            hasCommits={hasCommits}
                        />
                    </TabPanel>

                    <TabPanel value="review">
                        <Text color="secondary">
                            Раздел ревью появится позже после проверки ментором.
                        </Text>
                    </TabPanel>
                </TabProvider>
            </Card>
        </Flex>
    );
};
