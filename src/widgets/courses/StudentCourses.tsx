'use client';
import { FC, useState, useEffect } from 'react';

import { apiFetch } from '@/shared/api';
import { CourseCard } from '@/widgets/coursecard';

import styles from './StudentCourses.module.css';

interface CourseFromAPI {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    assignments: string;
    enrollments: string;
}

export const StudentCourses: FC = () => {
    const [courses, setCourses] = useState<CourseFromAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const data = await apiFetch<CourseFromAPI[]>('/api/courses');
                setCourses(data);
            } catch (err) {
                console.error('Ошибка загрузки курсов:', err);
                setError('Не удалось загрузить список курсов');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleView = (title: string) => {
        alert(`Курс "${title}" пока не доступен. Страница в разработке!`);
    };

    if (courses.length === 0) {
        return (
            <div className={styles['container']}>
                <h1>Список курсов</h1>
                <div className={styles['empty']}>
                    <h2>Нет доступных курсов</h2>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['container']}>
            <h1>Список курсов</h1>
            <div className={styles['coursesList']}>
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        title={course.title}
                        description={course.description}
                        createdAt={course.createdAt}
                        updatedAt={course.updatedAt}
                        assignmentsCount={course.assignments?.length || 0}
                        enrollmentsCount={course.enrollments?.length || 0}
                        onView={handleView}
                    />
                ))}
            </div>
        </div>
    );
};
