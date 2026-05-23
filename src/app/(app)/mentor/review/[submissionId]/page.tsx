import { apiFetch } from '@/shared/api';
import { RepoDiff } from '@/widgets/review-submission/ui/ReviewDiff/ReviewMockRepository';
import { ReviewSubmissionClient } from '@/widgets/review-submission/ui/ReviewSubmissionClient/ReviewSubmissionClient';

import type { User } from '@/shared/types/user';

interface ReviewSubmissionProps {
    params: {
        submissionId: string;
    };
}

async function ReviewSubmissionPage({ params }: ReviewSubmissionProps) {
    //const user = await apiFetch<User>('/api/me');

    const id = (await params).submissionId;
    const fileData = await apiFetch<RepoDiff>(`/submissions/${id}/diff`);
    //const fileData = repoDiff;
    return (
        <div>
            <p>This is review submission page</p>
            <ReviewSubmissionClient fileChanges={fileData} />
        </div>
    );
}

export default ReviewSubmissionPage;
