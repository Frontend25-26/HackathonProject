'use client';

import { useState } from 'react';
import { Card, Text, Button, Flex } from '@gravity-ui/uikit';
import { MyWork } from '@/entities/submission';
import type { Assignment } from '@/shared/types/assignment';
import type { Submission } from '@/shared/types/submission';
import { formatDueDate } from '@/shared/utils/helpers';
import styles from './AssignmentDetails.module.css';

interface Props {
    assignment: Assignment;
    submission?: Submission;
}

const getAssignmentStatus = (assignment: Assignment, isCompleted?: boolean): { text: string; className: string } => {
    if (isCompleted) return { text: 'Сдано', className: styles.statusCompleted };
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    if (dueDate < now) return { text: 'Просрочено', className: styles.statusOverdue };
    return { text: 'Активно', className: styles.statusActive };
};

export const AssignmentDetails = ({ assignment, submission }: Props) => {
    const [activeTab, setActiveTab] = useState<'description' | 'my-work' | 'review'>('description');

    const hasSubmission = !!submission;
    const hasCommits = !!submission?.repoUrl;
    const isCompleted = submission?.status === 'APPROVED';
    const { text: statusText, className: statusClass } = getAssignmentStatus(assignment, isCompleted);

    const handleAccept = () => {
        if (assignment.inviteLink) {
            window.location.href = assignment.inviteLink;
        }
    };

    return (
        <div className={styles.page}>
            <Card className={styles.card}>
                <Flex justifyContent="space-between" alignItems="center" className={styles.header}>
                    <Text variant="display-1">
                        {assignment.title}
                    </Text>
                    <span className={`${styles.statusBadge} ${statusClass}`}>{statusText}</span>
                </Flex>

                <Flex gap={8} className={styles.meta}>
                    <Text>
                        <Text>Дедлайн: </Text>
                        {formatDueDate(assignment.dueDate)}
                    </Text>
                    <Text>
                        <Text>Макс. балл: </Text>
                        {assignment.maxGrade}
                    </Text>
                </Flex>

                {!hasSubmission && (
                    <div className={styles.acceptButton}>
                        <Button view="action" size="l" onClick={handleAccept}>
                            Принять задание
                        </Button>
                    </div>
                )}

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'description' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Описание
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'my-work' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('my-work')}
                    >
                        Моя работа
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'review' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('review')}
                    >
                        Ревью
                    </button>
                </div>

                <div>
                    {activeTab === 'description' && (
                        <div className={styles.description}>
                            <Text>{assignment.description || 'Нет описания'}</Text>
                        </div>
                    )}

                    {activeTab === 'my-work' && (
                        <MyWork
                            assignmentId={assignment.id}
                            submission={submission}
                            hasSubmission={hasSubmission}
                            hasCommits={hasCommits}
                        />
                    )}

                    {activeTab === 'review' && (
                        <Text color="secondary">Раздел ревью появится позже после проверки ментором.</Text>
                    )}
                </div>
            </Card>
        </div>
    );
};