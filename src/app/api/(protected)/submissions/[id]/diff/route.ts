import { NextRequest } from 'next/server';

import { reposApi } from '@backend/github/repos';
import { requireAuth } from '@backend/lib/auth';
import { prisma } from '@backend/lib/prisma';

export const GET = async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
): Promise<Response> => {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    const submissionId = Number(id);

    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
    });

    if (!submission) {
        return Response.json({ error: 'Работа не найдена' }, { status: 404 });
    }

    const isStudent = auth.user.role === 'STUDENT';
    if (isStudent && submission.studentId !== auth.user.id) {
        return Response.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    let { repoOwner: owner, repoName: repo } = submission;

    if ((!owner || !repo) && submission.repoUrl) {
        const match = submission.repoUrl.match(
            /github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/,
        );
        if (match) {
            owner = match[1];
            repo = match[2];
            await prisma.submission.update({
                where: { id: submissionId },
                data: { repoOwner: owner, repoName: repo },
            });
        }
    }

    if (!owner || !repo) {
        return Response.json(
            { error: 'Репозиторий не привязан к работе' },
            { status: 404 },
        );
    }

    let prNumber = submission.prNumber;

    if (!prNumber) {
        const prs = await reposApi
            .listPullRequests(owner, repo)
            .catch(() => []);
        const openPr = prs.find((pr) => pr.state === 'open') ?? prs[0];
        if (openPr) {
            prNumber = openPr.number;
            await prisma.submission.update({
                where: { id: submissionId },
                data: { prNumber },
            });
        }
    }

    if (!prNumber) {
        return Response.json(
            { error: 'Pull Request не найден в репозитории' },
            { status: 404 },
        );
    }

    const files = await reposApi
        .listPullRequestFiles(owner, repo, prNumber)
        .catch(() => []);

    return Response.json({ prNumber, files });
};
