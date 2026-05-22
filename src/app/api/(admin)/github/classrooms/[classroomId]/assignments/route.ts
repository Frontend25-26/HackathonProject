/**
 * GET /api/github/classrooms/[classroomId]/assignments — список заданий классрума
 *
 * Группа: (admin) — требует роль ADMIN.
 */

import { NextRequest } from 'next/server';

import { classroomApi } from '@backend/github/classroom';
import { requireAdmin } from '@backend/lib/auth';
import { userRepository } from '@backend/users/repository';

type Params = { params: Promise<{ classroomId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const dbUser = await userRepository.findById(auth.user.id);
    if (!dbUser?.githubToken) {
        return Response.json(
            { error: 'GitHub токен не найден. Переавторизуйтесь через GitHub' },
            { status: 401 },
        );
    }

    const { classroomId } = await params;

    try {
        const assignments = await classroomApi.listAssignments(
            Number(classroomId),
            dbUser.githubToken,
        );
        return Response.json(assignments);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'GitHub API error';
        const cause =
            err instanceof Error && (err as NodeJS.ErrnoException).cause
                ? String((err as NodeJS.ErrnoException).cause)
                : undefined;
        console.error('[classrooms/assignments]', err);
        return Response.json({ error: message, cause }, { status: 502 });
    }
}
