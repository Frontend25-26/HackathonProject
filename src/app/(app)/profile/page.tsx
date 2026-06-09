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

    const me = await apiFetch<User>('/api/me');

    let courses: Course[] = [];
    let students: (User & { courseName: string })[] = [];
    let mentors: User[] = [];

    if (me.role === 'STUDENT') {
        courses = await apiFetch<Course[]>('/api/courses');
    } else if (me.role === 'MENTOR') {
        const allEnrollments = await apiFetch<Enrollment[]>('/api/enrollments');
        const enrollments = allEnrollments.filter((e) => e.mentorId === me.id);

        const courseIds = [...new Set(enrollments.map((e) => e.courseId))];
        const studentIds = [...new Set(enrollments.map((e) => e.studentId))];

        const [coursesData, studentsData] = await Promise.all([
            Promise.allSettled(
                courseIds.map((id) => apiFetch<Course>(`/api/courses/${id}`)),
            ),
            Promise.allSettled(
                studentIds.map((id) => apiFetch<User>(`/api/users/${id}`)),
            ),
        ]);

        const courseMap = new Map(
            coursesData
                .filter(
                    (r): r is PromiseFulfilledResult<Course> =>
                        r.status === 'fulfilled',
                )
                .map((r) => [r.value.id, r.value.title]),
        );

        const studentMap = new Map(
            studentsData
                .filter(
                    (r): r is PromiseFulfilledResult<User> =>
                        r.status === 'fulfilled',
                )
                .map((r) => [r.value.id, r.value]),
        );

        students = enrollments
            .map((enrollment) => {
                const student = studentMap.get(enrollment.studentId);
                if (!student) return null;
                return {
                    ...student,
                    courseName:
                        courseMap.get(enrollment.courseId) ||
                        `Курс ${enrollment.courseId}`,
                };
            })
            .filter((s): s is User & { courseName: string } => s !== null);
    } else if (me.role === 'ADMIN') {
        courses = await apiFetch<Course[]>('/api/courses');
        try {
            mentors = await apiFetch<User[]>('/api/users?role=MENTOR');
        } catch {
            const allUsers = await apiFetch<User[]>('/api/users');
            mentors = allUsers.filter((u) => u.role === 'MENTOR');
        }
    }

    return (
        <Profile
            user={me}
            courses={courses}
            students={students}
            mentors={mentors}
        />
    );
};

export default ProfilePage;
