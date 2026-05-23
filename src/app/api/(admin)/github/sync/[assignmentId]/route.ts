import { NextRequest } from 'next/server';

import {
    syncCommits,
    syncPRComments,
    syncStudentRepos,
} from '@backend/github/sync';
import { requireAdmin } from '@backend/lib/auth';
import { prisma } from '@backend/lib/prisma';
import { userRepository } from '@backend/users/repository';

export const POST = async (
    _request: NextRequest,
    { params }: { params: Promise<{ assignmentId: string }> },
): Promise<Response> => {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { assignmentId } = await params;
    const id = Number(assignmentId);

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
        return Response.json({ error: 'Задание не найдено' }, { status: 404 });
    }

    const dbUser = await userRepository.findById(auth.user.id);
    await syncStudentRepos(id, dbUser?.githubToken ?? undefined);

    const submissions = await prisma.submission.findMany({
        where: { assignmentId: id },
        select: { id: true },
    });

    await Promise.allSettled(
        submissions.flatMap((s) => [syncCommits(s.id), syncPRComments(s.id)]),
    );

    return Response.json({ ok: true, synced: submissions.length });
};
