import { AssignmentDetails } from '@/entities/assignment';
import { apiFetch } from '@/shared/api';

import type { Assignment } from '@/shared/types/assignment';
import type { Submission } from '@/shared/types/submission';

interface PageProps {
    params: Promise<{ id: string }>;
}

const AssignmentPage = async ({ params }: PageProps) => {
    const { id } = await params;
    const assignmentId = parseInt(id, 10);

    let studentId: number | undefined;
    try {
        const me = await apiFetch<{ id: number }>('/api/me');
        studentId = me.id;
    } catch (error) {
        console.error('Cannot get student ID:', error);
    }

    const assignment = await apiFetch<Assignment>(
        `/api/assignments/${assignmentId}`,
    );

    let submission: Submission | undefined;
    if (studentId) {
        try {
            const submissions = await apiFetch<Submission[]>(
                `/api/submissions?assignmentId=${assignmentId}&studentId=${studentId}`,
            );
            submission = submissions?.[0];
        } catch (error) {
            console.error('Cannot load submission:', error);
        }
    }

    return (
        <AssignmentDetails assignment={assignment} submission={submission} />
    );
};

export default AssignmentPage;
