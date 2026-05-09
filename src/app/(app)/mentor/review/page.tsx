import { Submission } from '@/entities/submission';
import { apiFetch } from '@/shared/api';
import { ReviewClient } from '@/widgets/review/ui/ReviewClient';

import type { AssignmentSchema } from '@/shared/types/assgnment';
import type { CourseSchema } from '@/shared/types/course';
import type { EnrollmentSchema } from '@/shared/types/enrollment';
import type { SubmissionSchema } from '@/shared/types/submission';
import type { UserSchema } from '@/shared/types/user';

/*
const MOCK_DATA: Submission[] = [
    {id: '1', Student: 'Алиса Иванова', Course: 'JS', HW: 'Typescript', Deadline: '24.04.2028', CIStatus: 'in-progress', LastCommitDate: '21.13.2027'},
    {id: '2', Student: 'Боб Козлов', Course: 'Верстка', HW: 'Адаптивная верстка', Deadline: '24.03.2025', CIStatus: 'needs-submission', LastCommitDate: '21.03.2025'},
    {id: '3', Student: 'Идеальный студент', Course: 'Верстка', HW: 'Fast-development', Deadline: '14.03.2025', CIStatus: 'done', LastCommitDate: '11.03.2025'},
];
*/

function toKey(student: number, course: number): string {
    return student + '@' + course;
}

async function formatFetchedReview(
    submission: SubmissionSchema,
    enrollmentMapper: Set<string>,
    courses: CourseSchema[],
): Promise<Submission | null> {
    const assignment: AssignmentSchema = await apiFetch(
        '/api/assignments/' + submission.assignmentId,
    );
    console.log(assignment);

    if (
        enrollmentMapper.has(toKey(submission.student.id, assignment.courseId))
    ) {
        return {
            id: submission.id.toString(),
            Student: submission.student.name,
            Course: courses[assignment.courseId - 1].title,
            HW: assignment.title,
            Deadline: assignment.dueDate,
            CIStatus: submission.ciStatus,
            LastCommitDate: submission.updatedAt,
            RepositoryUrl: submission.repoUrl,
        };
    } else {
        return null;
    }
}

export default async function ReviewPage() {
    const fetchedData: SubmissionSchema[] = await apiFetch('/api/submissions');

    const myId: number = ((await apiFetch('/api/me')) as UserSchema).id;
    const enrollments: EnrollmentSchema[] = await apiFetch('/api/enrollments');
    const courses: CourseSchema[] = await apiFetch('/api/courses');
    const myEnrollments = enrollments.filter(
        (enrollment) => enrollment.mentorId === myId,
    );

    const enrollmentMapper: Set<string> = new Set(
        myEnrollments.map((enrollment) => {
            return toKey(enrollment.studentId, enrollment.courseId);
        }),
    );

    console.log('!!!');
    console.log(enrollmentMapper);

    const nulledData = await Promise.all(
        fetchedData.map(async (submission) => {
            return await formatFetchedReview(
                submission,
                enrollmentMapper,
                courses,
            );
        }),
    );
    const data = nulledData.filter((item): item is Submission => item !== null);

    return <ReviewClient data={data} />;
}
