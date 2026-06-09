import { StudentAssignments } from '@/entities/assignment';
import { auth } from '@/features/auth/authSetup';
import { apiFetch } from '@/shared/api';

import type { Assignment } from '@/entities/assignment';
import type { Course } from '@/entities/course';
import type { Submission } from '@/entities/submission';

interface PageProps {
    searchParams?: Promise<{ courseId?: string }>;
}

const StudentAssignmentsPage = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    const courseId = params?.courseId ? parseInt(params.courseId) : undefined;

    const session = await auth();
    const studentId = session?.user?.userId;

    const [assignments, courses] = await Promise.all([
        apiFetch<Assignment[]>('/api/assignments'),
        apiFetch<Course[]>('/api/courses'),
    ]);

    const submissions = await apiFetch<Submission[]>('/api/submissions', {
        query: { studentId },
    });

    return (
        <StudentAssignments
            assignments={assignments}
            courses={courses}
            submissions={submissions}
            initialCourseId={courseId}
        />
    );
};

export default StudentAssignmentsPage;
