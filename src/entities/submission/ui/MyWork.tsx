'use client';

import { Text, Link, Flex } from '@gravity-ui/uikit';
import { useEffect, useState } from 'react';

import { apiFetch } from '@/shared/api';

import { CiBadge } from './CiBadge';
import { CommitHistory } from './CommitHistory';

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

    useEffect(() => {
        if (!submission?.id || !hasCommits) return;

        const abortController = new AbortController();

        apiFetch<Commit[]>(
            `/api/submissions/${submission.id}/commits?refresh=1`,
            {
                signal: abortController.signal,
            },
        )
            .then(setCommits)
            .catch((err) => {
                if (err.name !== 'AbortError')
                    console.error('Commits error:', err);
            })
            .finally(() => setLoading(false));

        return () => abortController.abort();
    }, [submission, hasCommits]);

    if (!hasSubmission) {
        return <Text>Вы ещё не приняли задание. Нажмите Принять.</Text>;
    }

    if (!hasCommits) {
        return (
            <Text>
                Задание принято, но коммитов пока нет. После первого коммита
                здесь появится информация.
            </Text>
        );
    }

    if (!submission) return null;

    return (
        <Flex direction="column" gap={4}>
            <Flex gap={4} alignItems="center">
                <Text>Репозиторий:</Text>
                <Link href={submission.repoUrl} target="_blank">
                    {submission.repoUrl}
                </Link>
                <CiBadge status={submission.ciStatus} />
            </Flex>
            {!loading && <CommitHistory commits={commits} />}
        </Flex>
    );
};
