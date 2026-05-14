import { Submission } from '@/entities/submission';
import { apiFetch } from '@/shared/api';
import { ReviewClient } from '@/widgets/review/ui/ReviewClient';

import type { AssignmentSchema } from '@/shared/types/assignment';
import type { CourseSchema } from '@/shared/types/course';
import type { EnrollmentSchema } from '@/shared/types/enrollment';
import type { SubmissionSchema } from '@/shared/types/submission';
import type { UserSchema } from '@/shared/types/user';

const toKey = (student: number, course: number): string => {
    return student + '@' + course;
};

const formatFetchedReview = async (
    submission: SubmissionSchema,
    enrollmentMapper: Set<string>,
    courses: Map<number, CourseSchema>,
    assignments: Map<number, AssignmentSchema>,
): Promise<Submission | null> => {
    const assignment = assignments.get(submission.assignmentId);

    if (
        assignment &&
        courses.get(assignment.courseId) &&
        enrollmentMapper.has(toKey(submission.student.id, assignment.courseId))
    ) {
        return {
            id: submission.id.toString(),
            Student: submission.student.name,
            Course: courses.get(assignment.courseId)!.title,
            HW: assignment.title,
            Deadline: assignment.dueDate,
            CIStatus: submission.ciStatus,
            LastCommitDate: submission.updatedAt,
            RepositoryUrl: submission.repoUrl,
        };
    } else {
        return null;
    }
};

export default async function ReviewPage() {
    const requiredStatuses = ['APPROVED', 'PENDING', 'CHANGES_REQUESTED'];
    const fetchedData: SubmissionSchema[] = await apiFetch(
        `/api/submissions?statuses=${requiredStatuses.join(',')}`,
    );

    const myId: number = ((await apiFetch('/api/me')) as UserSchema).id;
    const enrollments: EnrollmentSchema[] = await apiFetch('/api/enrollments');
    const courses: CourseSchema[] = await apiFetch('/api/courses');

    const coursesMap = new Map<number, CourseSchema>();
    for (const course of courses) {
        coursesMap.set(course.id, course);
    }

    const assignments: AssignmentSchema[] = await apiFetch(`/api/assignments`);

    const assignmentsMap = new Map<number, AssignmentSchema>();
    for (const assignment of assignments) {
        assignmentsMap.set(assignment.id, assignment);
    }

    const myEnrollments = enrollments.filter(
        (enrollment) => enrollment.mentorId === myId,
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
    const data = nulledData.filter((item): item is Submission => item !== null);

    data.sort((a, b) => b.LastCommitDate.localeCompare(a.LastCommitDate));

    return <ReviewClient data={data} />;
}
