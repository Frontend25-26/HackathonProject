import { AssignmentDetails } from '@/entities/assignment';
import { auth } from '@/features/auth/authSetup';
import { apiFetch } from '@/shared/api';

import type { Assignment } from '@/shared/types/assignment';
import type { Submission } from '@/shared/types/submission';

interface PageProps {
    params: Promise<{ id: string }>;
}

const AssignmentPage = async ({ params }: PageProps) => {
    const { id } = await params;
    const assignmentId = parseInt(id, 10);

    const session = await auth();
    const studentId = session?.user?.userId;

    const assignment = await apiFetch<Assignment>(
        `/api/assignments/${assignmentId}`,
    );

    let submission: Submission | undefined;
    try {
        const submissions = await apiFetch<Submission[]>('/api/submissions', {
            query: { assignmentId, studentId },
        });
        submission = submissions?.[0];
    } catch (error) {
        console.error('Cannot load submission:', error);
    }

    return (
        <AssignmentDetails assignment={assignment} submission={submission} />
    );
};

export default AssignmentPage;
