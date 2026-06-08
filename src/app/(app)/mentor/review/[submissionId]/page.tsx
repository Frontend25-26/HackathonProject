import { apiFetch } from '@/shared/api';
import {
    ReviewSubmissionClient,
    ReviewHeader,
} from '@/widgets/review-submission';

import type {
    Assignment,
    Commit,
    FileChange,
    Submission,
} from '@/shared/types';

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
    let commits: Commit[];
    let submission: Submission;
    try {
        [fileData, commits, submission] = await Promise.all([
            apiFetch<DiffFetch>(`/api/submissions/${a.submissionId}/diff`),
            apiFetch<Commit[]>(`/api/submissions/${a.submissionId}/commits`),
            apiFetch<Submission>(`/api/submissions/${a.submissionId}`),
        ]);
    } catch {
        return <p>Работа не найдена</p>;
    }

    const assignment = await apiFetch<Assignment>(
        `/api/assignments/${submission.assignmentId}`,
    );

    return (
        <div>
            <ReviewHeader
                commits={commits}
                submission={submission}
                assignment={assignment}
            />
            <ReviewSubmissionClient fileChanges={fileData.files} />
        </div>
    );
}

export default ReviewSubmissionPage;
