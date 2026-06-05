import { FC } from 'react';

import { StudentAssignments } from '@/entities/assignment';
import { apiFetch } from '@/shared/api';

import type { Assignment } from '@/entities/assignment';
import type { Course } from '@/entities/course';

interface PageProps {
    searchParams?: Promise<{
        courseId?: string;
    }>;
}

const StudentAssignmentsPage: FC<PageProps> = async ({ searchParams }) => {
    const params = await searchParams;
    const courseId = params?.courseId ? parseInt(params.courseId) : undefined;

    const [assignments, courses] = await Promise.all([
        apiFetch<Assignment[]>('/api/assignments'),
        apiFetch<Course[]>('/api/courses'),
    ]);

    return (
        <StudentAssignments
            assignments={assignments}
            courses={courses}
            initialCourseId={courseId}
        />
    );
};

export default StudentAssignmentsPage;
