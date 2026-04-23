/**
 * PATCH  /api/review-comments/[id] — редактировать комментарий
 * DELETE /api/review-comments/[id] — удалить комментарий
 *
 * - MENTOR может редактировать/удалять везде
 * - STUDENT может редактировать/удалять только свои комментарии
 */

import { NextRequest } from 'next/server';

import { requireAuth } from '@backend/lib/auth';
import { reviewCommentRepository } from '@backend/review-comments/repository';
import { UpdateReviewCommentSchema } from '@backend/review-comments/schema';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response;

    const { id } = await params;
    const comment = await reviewCommentRepository.findById(Number(id));

    if (!comment) {
        return Response.json(
            { error: 'Комментарий не найден' },
            { status: 404 },
        );
    }

    // Только автор может редактировать свой комментарий
    if (comment.authorId !== auth.user.id) {
        return Response.json(
            { error: 'Вы не можете редактировать чужие комментарии' },
            { status: 403 },
        );
    }

    const body: unknown = await request.json();
    const parsed = UpdateReviewCommentSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 });
    }

    const updated = await reviewCommentRepository.update(
        Number(id),
        parsed.data,
    );
    return Response.json(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response;

    const { id } = await params;
    const comment = await reviewCommentRepository.findById(Number(id));

    if (!comment) {
        return Response.json(
            { error: 'Комментарий не найден' },
            { status: 404 },
        );
    }

    // MENTOR/ADMIN может удалять везде
    if (auth.user.role === 'MENTOR' || auth.user.role === 'ADMIN') {
        await reviewCommentRepository.delete(Number(id));
        return Response.json(null, { status: 204 });
    }

    // STUDENT может удалять только свои комментарии
    if (auth.user.role === 'STUDENT') {
        if (comment.authorId !== auth.user.id) {
            return Response.json(
                { error: 'Вы не можете удалять чужие комментарии' },
                { status: 403 },
            );
        }

        await reviewCommentRepository.delete(Number(id));
        return Response.json(null, { status: 204 });
    }

    return Response.json({ error: 'Доступ запрещен' }, { status: 403 });
}
