'use client';
import { Card, Flex } from '@gravity-ui/uikit';
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
        <Flex direction="column">
            <div className={styles.header}>
                <h3 className={styles.title}>{course.title}</h3>
            </div>

            <Flex
                className={styles.body}
                justifyContent="space-between"
                alignItems="flex-start"
            >
                <p className={styles.description}>
                    {course.description || 'Пока не добавили('}
                </p>

                <Flex direction="column" className={styles.dates}>
                    <Flex
                        justifyContent="space-between"
                        className={styles.date}
                    >
                        <span className={styles.datetext}>Создан:</span>
                        <span className={styles.datenum}>
                            {formatDate(course.createdAt)}
                        </span>
                    </Flex>
                    <Flex
                        justifyContent="space-between"
                        className={styles.date}
                    >
                        <span className={styles.datetext}>Обновлен:</span>
                        <span className={styles.datenum}>
                            {formatDate(course.updatedAt)}
                        </span>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    </Card>
);
