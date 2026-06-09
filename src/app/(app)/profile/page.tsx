import { Profile } from '@/entities/user';
import { auth } from '@/features/auth/authSetup';
import { apiFetch } from '@/shared/api';

import type { Course } from '@/entities/course';
import type { Enrollment } from '@/shared/types/enrollment';
import type { User } from '@/shared/types/user';

const ProfilePage = async () => {
    const session = await auth();
    if (!session?.user?.userId) {
        throw new Error('Пользователь не авторизован');
    }
    const rawMe = await apiFetch<Record<string, unknown>>('/api/me');
    const me = rawMe as unknown as User;

    let courses: Course[] = [];
    let students: (User & { courseName: string })[] = [];

    if (me.role === 'STUDENT') {
        courses = await apiFetch<Course[]>('/api/courses');
    } else if (me.role === 'MENTOR') {
        const enrollments = await apiFetch<Enrollment[]>(
            `/api/enrollments?mentorId=${me.id}`,
        );
        const studentIds = [...new Set(enrollments.map((e) => e.studentId))];
        const courseIds = [...new Set(enrollments.map((e) => e.courseId))];

        const rawStudents = await Promise.all(
            studentIds.map((id) =>
                apiFetch<Record<string, unknown>>(`/api/users/${id}`),
            ),
        );
        const coursesData = await Promise.all(
            courseIds.map((id) => apiFetch<Course>(`/api/courses/${id}`)),
        );

        const studentMap = new Map(
            rawStudents.map((s) => [s.id as number, s as unknown as User]),
        );
        const courseMap = new Map(coursesData.map((c) => [c.id, c.title]));

        students = enrollments.map((enrollment) => ({
            ...studentMap.get(enrollment.studentId)!,
            courseName:
                courseMap.get(enrollment.courseId) ||
                `Курс ${enrollment.courseId}`,
        }));
    }

    return <Profile user={me} courses={courses} students={students} />;
};

export default ProfilePage;
