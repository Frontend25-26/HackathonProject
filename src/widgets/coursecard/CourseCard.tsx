'use client';
import { FC } from 'react';

import styles from './CourseCard.module.css';

interface CourseCardProps {
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    assignmentsCount: number;
    enrollmentsCount: number;
    onView?: (title: string) => void;
}

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

const truncate = (text: string, max = 120) =>
    !text
        ? 'Описание отсутствует'
        : text.length <= max
          ? text
          : text.slice(0, max) + '...';

export const CourseCard: FC<CourseCardProps> = ({
    title,
    description,
    createdAt,
    updatedAt,
    assignmentsCount,
    enrollmentsCount,
    onView,
}) => (
    <div className={styles.card} onClick={() => onView?.(title)}>
        <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
                <h3 className={styles.title}>{title}</h3>
            </div>

            <div className={styles.cardBody}>
                <p className={styles.description}>{truncate(description)}</p>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Заданий:</span>
                        <span className={styles.statValue}>
                            {assignmentsCount}
                        </span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Записей:</span>
                        <span className={styles.statValue}>
                            {enrollmentsCount}
                        </span>
                    </div>
                </div>

                <div className={styles.dates}>
                    <div className={styles.dateItem}>
                        <span className={styles.dateLabel}>Создан:</span>
                        <span className={styles.dateValue}>
                            {formatDate(createdAt)}
                        </span>
                    </div>
                    <div className={styles.dateItem}>
                        <span className={styles.dateLabel}>Обновлен:</span>
                        <span className={styles.dateValue}>
                            {formatDate(updatedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
