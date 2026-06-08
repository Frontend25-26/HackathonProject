'use client';

import { useEffect, useMemo, useState } from 'react';

import { ApiError } from '@/shared/api';

import { assignMentorToEnrollment, fetchEnrollments, fetchUsers } from './api';

import type { Enrollment } from '@/shared/types/enrollment';
import type { User } from '@/shared/types/user';

export interface CourseStudentRow {
    index: number;
    studentName: string;
    studentId: number;
    mentorName: string | null;
    mentorId: number | null;
    enrollmentId: number;
}

type UseCourseEnrollmentsReturn = {
    students: CourseStudentRow[];
    allMentors: User[];
    isLoadingEnrollments: boolean;
    error: string | null;
    assignMentor: (
        enrollmentId: number,
        mentorId: number | null,
    ) => Promise<void>;
};

export const useCourseEnrollments = (
    courseId: number,
): UseCourseEnrollmentsReturn => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoadingEnrollments, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const allMentors: User[] = useMemo(
        () => allUsers.filter((u) => u.role === 'MENTOR' || u.role === 'ADMIN'),
        [allUsers],
    );

    const students: CourseStudentRow[] = useMemo(() => {
        const userMap = new Map(allUsers.map((u) => [u.id, u]));

        return enrollments.map((enc, idx) => {
            const student = userMap.get(enc.studentId);
            const mentor = enc.mentorId ? userMap.get(enc.mentorId) : null;

            return {
                index: idx + 1,
                studentName:
                    student?.name ??
                    student?.githubId.toString() ??
                    'Неизвестный студент',
                studentId: enc.studentId,
                mentorName: mentor?.name ?? null,
                mentorId: enc.mentorId,
                enrollmentId: enc.id,
            };
        });
    }, [enrollments, allUsers]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [encData, usersData] = await Promise.all([
                    fetchEnrollments(courseId),
                    fetchUsers(),
                ]);

                setEnrollments(encData);
                setAllUsers(usersData);
            } catch (err) {
                const apiErr = err instanceof ApiError ? err : null;
                setError(apiErr?.message || 'Ошибка загрузки данных студентов');
            } finally {
                setIsLoading(false);
            }
        };

        void loadData();
    }, [courseId]);

    const assignMentor = async (
        enrollmentId: number,
        newMentorId: number | null,
    ): Promise<void> => {
        const currentEnrollment = enrollments.find(
            (enc) => enc.id === enrollmentId,
        );
        const previousMentorId = currentEnrollment?.mentorId ?? null;

        setEnrollments((prev) =>
            prev.map((enc) =>
                enc.id === enrollmentId
                    ? { ...enc, mentorId: newMentorId }
                    : enc,
            ),
        );
        setError(null);

        try {
            await assignMentorToEnrollment(enrollmentId, newMentorId);
        } catch {
            setEnrollments((prev) =>
                prev.map((enc) =>
                    enc.id === enrollmentId
                        ? { ...enc, mentorId: previousMentorId }
                        : enc,
                ),
            );
            setError('Не удалось назначить ментора. Повторите попытку.');
        }
    };

    return { students, allMentors, isLoadingEnrollments, error, assignMentor };
};
