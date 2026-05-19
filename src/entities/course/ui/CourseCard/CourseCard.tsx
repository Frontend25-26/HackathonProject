'use client';
import { Card } from '@gravity-ui/uikit';
import { FC } from 'react';

import { Course } from '../../api/types';

import styles from './CourseCard.module.css';

interface CourseCardStats {
    course: Course;
    onView?: (id: number) => void;
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('ru-RU');

export const CourseCard: FC<CourseCardStats> = ({ course, onView }) => (
    <Card
        className={styles.card}
        onClick={() => onView?.(course.id)}
        type="action"
        theme="normal"
        view="clear"
    >
        <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
                <h3 className={styles.title}>{course.title}</h3>
            </div>

            <div className={styles.cardBody}>
                <p className={styles.description}>
                    {course.description || 'Пока не добавили('}
                </p>

                <div className={styles.dates}>
                    <div className={styles.dateItem}>
                        <span className={styles.dateLabel}>Создан:</span>
                        <span className={styles.dateValue}>
                            {formatDate(course.createdAt)}
                        </span>
                    </div>
                    <div className={styles.dateItem}>
                        <span className={styles.dateLabel}>Обновлен:</span>
                        <span className={styles.dateValue}>
                            {formatDate(course.updatedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </Card>
);
