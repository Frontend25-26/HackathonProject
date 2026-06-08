'use client';

import { Flex } from '@gravity-ui/uikit';
import Link from 'next/link';
import { FC, JSX } from 'react';

import { UserAvatar } from '@/shared/components/UserAvatar';
import { Assignment, Commit, Submission } from '@/shared/types';
import { formatDateFromISODate, formatDueDate } from '@/shared/utils/helpers';
import { CIBadge } from '@/widgets/CIBadge';

import styles from './ReviewHeader.module.css';

interface ReviewHeaderProps {
    commits: Commit[];
    submission: Submission;
    assignment: Assignment;
}

const formatSha: (sha: string) => string = (sha) => {
    return sha.slice(0, 6);
};

const renderCommit: (commit: Commit) => JSX.Element = (commit) => {
    return (
        <div className={styles.commitWrapper} key={commit.sha}>
            <div className={styles.commitDate}>
                {formatDateFromISODate(commit.committedAt)}
            </div>
            <div className={styles.commit}>
                <div className={styles.commitHeader}>
                    <span className={styles.commitTitle}>
                        {commit.message}
                        <span className={styles.badge}>
                            <CIBadge status={commit.ciStatus} size={18} />
                        </span>
                    </span>
                    <span className={styles.commitSha}>
                        {formatSha(commit.sha)}
                    </span>
                </div>
            </div>
        </div>
    );
};
export const ReviewHeader: FC<ReviewHeaderProps> = ({
    commits,
    submission,
    assignment,
}) => {
    const lastCommits = commits.slice(0, 10);
    const student = submission.student;
    return (
        <div className={styles.reviewHeader}>
            <Flex direction={'column'}>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <h2 className={styles.assignmentTitle}>
                        {assignment.title}
                        <span className={styles.badge}>
                            <CIBadge status={submission.ciStatus} size={24} />
                        </span>
                    </h2>

                    <Link
                        href={`/user/${student.id}`}
                        className={styles.studentInfo}
                    >
                        <span className={styles.studentName}>Автор:</span>
                        <UserAvatar
                            avatarUrl={student.avatar}
                            name={student.name}
                            borderColor={'var(--g-color-text-positive)'}
                        />
                        <span className={styles.studentName}>
                            {student.name}
                        </span>
                    </Link>
                </Flex>

                <Flex direction={'column'} gap={2}>
                    <span>Дедлайн: {formatDueDate(assignment.dueDate)}</span>
                    {assignment.classroomUrl && (
                        <Link href={assignment.classroomUrl}>Classroom</Link>
                    )}

                    <span>
                        {'Репозиторий: '}
                        <Link href={submission.repoUrl}>
                            {submission.repoName}
                        </Link>
                    </span>
                </Flex>
            </Flex>

            <h3>Коммиты ({lastCommits.length}):</h3>
            <div className={styles.commits}>
                {lastCommits.map((commit) => renderCommit(commit))}
            </div>
        </div>
    );
};
