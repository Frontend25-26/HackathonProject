import { apiFetch } from '@/shared/api';
import { ReviewSubmissionClient } from '@/widgets/review-submission/ui/ReviewSubmissionClient/ReviewSubmissionClient';

interface ReviewSubmissionProps {
    params: {
        submissionId: string;
    };
}

import type { FileChange } from '@/shared/types/file-diff';

interface DiffFetch {
    files: FileChange[];
}

async function ReviewSubmissionPage({ params }: ReviewSubmissionProps) {
    const id = (await params).submissionId;
    const fileData = await apiFetch<DiffFetch>(`/api/submissions/${id}/diff`);
    return (
        <div>
            <ReviewSubmissionClient fileChanges={fileData.files} />
        </div>
    );
}

export default ReviewSubmissionPage;
