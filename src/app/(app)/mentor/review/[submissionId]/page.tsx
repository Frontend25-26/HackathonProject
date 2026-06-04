import { apiFetch } from '@/shared/api';
import { ReviewSubmissionClient } from '@/widgets/review-submission';

import type { FileChange } from '@/shared/types/file-diff';

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

    return <ReviewSubmissionClient fileChanges={fileData.files} />;
}

export default ReviewSubmissionPage;
