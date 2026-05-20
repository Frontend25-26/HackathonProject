'use client';
import { FC } from 'react';

import { CourseCard } from '@/entities/course/ui/CourseCard';

import { Course } from '../../api/types';

import styles from './StudentCourses.module.css';

export const StudentCourses: FC<{ courses: Course[] }> = ({ courses }) => {
    const handleView = (id: number) => {
        console.log('Переход на курс:', id);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Список курсов</h1>
            {!courses || courses.length === 0 ? (
                <div className={styles.empty}>
                    <h2>Нет доступных курсов</h2>
                </div>
            ) : (
                <div className={styles.coursesList}>
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onView={handleView}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
