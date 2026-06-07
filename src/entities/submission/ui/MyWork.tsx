'use client';
import { useEffect, useState } from 'react';
import { Text, Link, Flex, Loader } from '@gravity-ui/uikit';
import { CiBadge } from '@/widgets/cibadge';
import { CommitHistory } from '@/widgets/commithistory';
import { apiFetch } from '@/shared/api';
import type { Submission, Commit } from '@/shared/types/submission';

interface Props {
    assignmentId: number;
    submission?: Submission;
    hasSubmission: boolean;
    hasCommits: boolean;
}

export const MyWork = ({ submission, hasSubmission, hasCommits }: Props) => {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [loading, setLoading] = useState(false);

    console.log('MyWork render:', { hasSubmission, hasCommits, submission });

    useEffect(() => {
        if (submission?.id && hasCommits) {
            setLoading(true);
            apiFetch<Commit[]>(`/api/submissions/${submission.id}/commits?refresh=1`)
                .then(setCommits)
                .catch(err => console.error('Commits error:', err))
                .finally(() => setLoading(false));
        }
    }, [submission, hasCommits]);

    if (!hasSubmission) {
        return <Text>Вы ещё не приняли задание. Нажмите "Принять".</Text>;
    }

    if (!hasCommits) {
        return <Text>Задание принято, но коммитов пока нет.</Text>;
    }

    if (!submission) return null;

    return (
        <Flex direction="column" gap={4}>
            <Flex gap={4} alignItems="center">
                <Text>Репозиторий:</Text>
                <Link href={submission.repoUrl} target="_blank">{submission.repoUrl}</Link>
                <CiBadge status={submission.ciStatus} />
            </Flex>
            {!loading && <CommitHistory commits={commits} />}
        </Flex>
    );
};