import { NextRequest } from 'next/server';

import { syncCommits } from '@backend/github/sync';
import { requireAuth } from '@backend/lib/auth';
import { prisma } from '@backend/lib/prisma';

export const GET = async (
    request: NextRequest,
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

    const refresh = request.nextUrl.searchParams.get('refresh') === '1';
    if (refresh) {
        await syncCommits(submissionId);
    }

    const commits = await prisma.commit.findMany({
        where: { submissionId },
        orderBy: { committedAt: 'desc' },
    });

    return Response.json(commits);
};
