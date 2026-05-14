import { createHmac, timingSafeEqual } from 'crypto';

import { NextRequest } from 'next/server';

import {
    syncCommits,
    syncPRComments,
    syncStudentRepos,
} from '@backend/github/sync';
import { prisma } from '@backend/lib/prisma';

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

async function verifySignature(
    request: NextRequest,
    rawBody: string,
): Promise<boolean> {
    if (!WEBHOOK_SECRET) return true;

    const signature = request.headers.get('x-hub-signature-256');
    if (!signature) return false;

    const hmac = createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(rawBody);
    const expected = `sha256=${hmac.digest('hex')}`;

    try {
        return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch {
        return false;
    }
}

async function findSubmissionByRepo(
    owner: string,
    repo: string,
): Promise<number | null> {
    const submission = await prisma.submission.findFirst({
        where: { repoOwner: owner, repoName: repo },
        select: { id: true },
    });
    return submission?.id ?? null;
}

export const POST = async (request: NextRequest): Promise<Response> => {
    const rawBody = await request.text();

    const valid = await verifySignature(request, rawBody);
    if (!valid) {
        return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = request.headers.get('x-github-event');
    let payload: Record<string, unknown>;

    try {
        payload = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
        return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const repo = payload.repository as
        | { name: string; owner: { login: string } }
        | undefined;
    const owner = repo?.owner?.login;
    const repoName = repo?.name;

    if (event === 'push' && owner && repoName) {
        const submissionId = await findSubmissionByRepo(owner, repoName);
        if (submissionId) {
            syncCommits(submissionId).catch(console.error);
        }
    }

    if (event === 'pull_request' && owner && repoName) {
        const action = payload.action as string | undefined;
        if (
            action === 'opened' ||
            action === 'reopened' ||
            action === 'synchronize'
        ) {
            const submissionId = await findSubmissionByRepo(owner, repoName);
            if (submissionId) {
                const pr = payload.pull_request as
                    | { number: number }
                    | undefined;
                if (pr?.number) {
                    await prisma.submission.update({
                        where: { id: submissionId },
                        data: { prNumber: pr.number, status: 'PENDING' },
                    });
                }
                syncCommits(submissionId).catch(console.error);
            }
        }
    }

    if (event === 'pull_request_review_comment' && owner && repoName) {
        const action = payload.action as string | undefined;
        if (action === 'created') {
            const submissionId = await findSubmissionByRepo(owner, repoName);
            if (submissionId) {
                syncPRComments(submissionId).catch(console.error);
            }
        }
    }

    if (event === 'check_run' && owner && repoName) {
        const submissionId = await findSubmissionByRepo(owner, repoName);
        if (submissionId) {
            syncCommits(submissionId).catch(console.error);
        }
    }

    // Автоопределение новых репозиториев (student принял задание)
    if (event === 'repository' && owner) {
        const action = payload.action as string | undefined;
        if (action === 'created' && repoName) {
            // Ищем assignment по организации — classroom-задания создают репо с паттерном <assignment-slug>-<login>
            const assignments = await prisma.assignment.findMany({
                where: { classroomAssignmentId: { not: null } },
                select: { id: true },
            });
            for (const a of assignments) {
                syncStudentRepos(a.id).catch(console.error);
            }
        }
    }

    return Response.json({ ok: true });
};
