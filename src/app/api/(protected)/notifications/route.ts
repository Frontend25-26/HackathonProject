/**
 * GET /api/notifications — список уведомлений текущего пользователя
 *
 * Query params:
 *   unread=true  — только непрочитанные
 *   limit=N      — количество (по умолчанию 10)
 */

import { NextRequest } from 'next/server';

import { requireAuth } from '@backend/lib/auth';
import { notificationRepository } from '@backend/notifications/repository';

export async function GET(request: NextRequest) {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { searchParams } = request.nextUrl;
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = Number(searchParams.get('limit') ?? '10') || 10;

    const notifications = await notificationRepository.findAll({
        userId: auth.user.id,
        unreadOnly,
        take: limit,
    });

    return Response.json(
        notifications.map(({ actor, actorId, ...n }) => ({
            ...n,
            source: actor
                ? {
                      authorId: actor.id,
                      userName: actor.login,
                      imgUrl: actor.avatar,
                  }
                : null,
        })),
    );
}
