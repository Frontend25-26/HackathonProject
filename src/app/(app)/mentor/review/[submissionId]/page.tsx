import { apiFetch } from '@/shared/api';
import { Assignment } from '@/shared/types/assignment';
import {
    ReviewSubmissionClient,
    ReviewHeader,
} from '@/widgets/review-submission';

import type { Commit } from '@/shared/types/commit';
import type { FileChange } from '@/shared/types/file-diff';
import type { Submission } from '@/shared/types/submission';

interface ReviewSubmissionProps {
    params: {
        submissionId: string;
    };
}

interface DiffFetch {
    files: FileChange[];
}

async function ReviewSubmissionPage({ params }: ReviewSubmissionProps) {
    const a = await params;
    let fileData: DiffFetch;
    try {
        fileData = await apiFetch<DiffFetch>(
            `/api/submissions/${a.submissionId}/diff`,
        );
    } catch {
        return <p>Работа не найдена</p>;
    }

    const commits = await apiFetch<Commit[]>(
        `/api/submissions/${a.submissionId}/commits?refresh=1`,
    );
    const submission = await apiFetch<Submission>(
        `/api/submissions/${a.submissionId}`,
    );
    const assignment = await apiFetch<Assignment>(
        `/api/assignments/${submission.assignmentId}`,
    );

    return (
        <div>
            <ReviewHeader
                commits={commits}
                submission={submission}
                assignment={assignment}
            ></ReviewHeader>
            <ReviewSubmissionClient fileChanges={fileData.files} />
        </div>
    );
}

export default ReviewSubmissionPage;
