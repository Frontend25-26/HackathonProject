/**
 * POST /api/notifications/read-all — отметить все уведомления как прочитанные
 */

import { requireAuth } from '@backend/lib/auth';
import { notificationRepository } from '@backend/notifications/repository';

export async function POST() {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const count = await notificationRepository.markAllRead(auth.user.id);

    return Response.json({ count });
}
