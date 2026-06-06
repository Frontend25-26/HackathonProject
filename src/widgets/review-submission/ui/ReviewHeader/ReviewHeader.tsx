'use client';

import { Avatar } from '@gravity-ui/uikit';
import { FC } from 'react';

import { Assignment } from '@/shared/types/assignment';
import { Commit } from '@/shared/types/commit';
import { Submission } from '@/shared/types/submission';
import { formatDateFromISODate, formatDueDate } from '@/shared/utils/helpers';
import { CIBadge } from '@/widgets/ciBadge/CIBadge';

import styles from './ReviewHeader.module.css';

interface ReviewHeaderProps {
    commits: Commit[];
    submission: Submission;
    assignment: Assignment;
}

const renderCommit = (commit: Commit) => {
    return (
        <div key={commit.sha} className={styles.commitWrapper}>
            <div className={styles.commitDate}>
                {formatDateFromISODate(commit.committedAt)}
            </div>
            <div className={styles.commit}>
                <div className={styles.commitHeader}>
                    <span className={styles.commitTitle}>
                        {commit.message}
                        <span className={styles.badge}>
                            <CIBadge
                                status={commit.ciStatus}
                                size={18}
                            ></CIBadge>
                        </span>
                    </span>
                    <span className={styles.commitSha}>
                        {commit.sha.slice(0, 6)}
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
    const avatar = student.avatar ? (
        <Avatar
            imgUrl={student.avatar}
            size="m"
            borderColor={'var(--g-color-text-positive)'}
        />
    ) : (
        <Avatar
            text={student.name}
            size="m"
            theme="brand"
            borderColor={'var(--g-color-text-positive)'}
        />
    );
    return (
        <div className={styles.reviewHeader}>
            <div className={styles.reviewInfo}>
                <div className={styles.headerTop}>
                    <h2 className={styles.assignmentTitle}>
                        {assignment.title}
                        <span className={styles.badge}>
                            <CIBadge
                                status={submission.ciStatus}
                                size={24}
                            ></CIBadge>
                        </span>
                    </h2>

                    <a
                        href={`/user/${student.id}`}
                        className={styles.studentInfo}
                    >
                        <span className={styles.studentName}>Автор:</span>
                        {avatar}
                        <span className={styles.studentName}>
                            {student.name}
                        </span>
                    </a>
                </div>

                <div className={styles.metaInfo}>
                    <div>Дедлайн: {formatDueDate(assignment.dueDate)}</div>

                    <div>
                        <a href={assignment.classroomUrl}>Classroom</a>
                    </div>

                    <div>
                        Репозиторий:{' '}
                        <a href={submission.repoUrl}>{submission.repoName}</a>
                    </div>
                </div>
            </div>

            <h3>Коммиты ({lastCommits.length}):</h3>
            <div className={styles.commits}>
                {lastCommits.map((commit) => renderCommit(commit))}
            </div>
        </div>
    );
};
