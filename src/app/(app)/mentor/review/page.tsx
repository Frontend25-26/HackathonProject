import { DisplayedSubmission } from '@/entities/submission';
import { apiFetch } from '@/shared/api';
import { ReviewClient } from '@/widgets/review/ui/ReviewClient/ReviewClient';

import type { Assignment } from '@/shared/types/assignment';
import type { Course } from '@/shared/types/course';
import type { Enrollment } from '@/shared/types/enrollment';
import type { Submission } from '@/shared/types/submission';
import type { User } from '@/shared/types/user';

const toKey = (student: number, course: number): string => {
    return student + '@' + course;
};

const formatFetchedReview = async (
    submission: Submission,
    enrollmentMapper: Set<string>,
    courses: Map<number, Course>,
    assignments: Map<number, Assignment>,
): Promise<DisplayedSubmission | null> => {
    const assignment = assignments.get(submission.assignmentId);

    if (
        assignment &&
        courses.get(assignment.courseId) &&
        enrollmentMapper.has(toKey(submission.student.id, assignment.courseId))
    ) {
        return {
            id: submission.id.toString(),
            student: submission.student.name,
            course: courses.get(assignment.courseId)!.title,
            hw: assignment.title,
            deadline: assignment.dueDate,
            ciStatus: submission.ciStatus,
            lastCommitDate: submission.updatedAt,
            repositoryUrl: submission.repoUrl,
        };
    } else {
        return null;
    }
};

const requiredStatuses = ['APPROVED', 'PENDING', 'CHANGES_REQUESTED'];

export default async function ReviewPage() {
    const [fetchedData, me, enrollments, courses, assignments] =
        await Promise.all([
            apiFetch<Submission[]>(
                `/api/submissions?statuses=${requiredStatuses.join(',')}`,
            ),
            apiFetch<User>('/api/me'),
            apiFetch<Enrollment[]>('/api/enrollments'),
            apiFetch<Course[]>('/api/courses'),
            apiFetch<Assignment[]>('/api/assignments'),
        ]);

    const coursesMap = new Map<number, Course>();
    for (const course of courses) {
        coursesMap.set(course.id, course);
    }

    const assignmentsMap = new Map<number, Assignment>();
    for (const assignment of assignments) {
        assignmentsMap.set(assignment.id, assignment);
    }

    const myEnrollments = enrollments.filter(
        (enrollment) => enrollment.mentorId === me.id,
    );

    const enrollmentMapper: Set<string> = new Set(
        myEnrollments.map((enrollment) => {
            return toKey(enrollment.studentId, enrollment.courseId);
        }),
    );

    const nulledData = await Promise.all(
        fetchedData.map(async (submission) => {
            return await formatFetchedReview(
                submission,
                enrollmentMapper,
                coursesMap,
                assignmentsMap,
            );
        }),
    );
    const data = nulledData.filter(
        (item): item is DisplayedSubmission => item !== null,
    );

    data.sort((a, b) => b.lastCommitDate.localeCompare(a.lastCommitDate));

    return <ReviewClient data={data} />;
}
