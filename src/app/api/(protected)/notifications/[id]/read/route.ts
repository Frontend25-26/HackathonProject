/**
 * PATCH /api/notifications/:id/read — отметить уведомление как прочитанное
 */

import { NextRequest } from 'next/server';

import { requireAuth } from '@backend/lib/auth';
import { notificationRepository } from '@backend/notifications/repository';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    const notifId = Number(id);

    if (isNaN(notifId)) {
        return Response.json({ error: 'Некорректный id' }, { status: 400 });
    }

    const notification = await notificationRepository.markRead(
        notifId,
        auth.user.id,
    );

    if (!notification) {
        return Response.json(
            { error: 'Уведомление не найдено' },
            { status: 404 },
        );
    }

    return Response.json(notification);
}
