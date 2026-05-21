import { apiFetch } from '@/shared/api';
import { ReviewSubmissionClient } from '@/widgets/review-submission/ui/ReviewSubmissionClient/ReviewSubmissionClient';

import type { User } from '@/shared/types/user';

async function ReviewSubmissionPage() {
    const user = await apiFetch<User>('/api/me');
    return (
        <div>
            <p>This is review submission page</p>
            <ReviewSubmissionClient />
        </div>
    );
}

export default ReviewSubmissionPage;
