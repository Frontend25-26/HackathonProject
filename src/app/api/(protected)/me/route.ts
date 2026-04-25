/**
 * GET /api/me — текущий пользователь и его роль
 *
 * Группа: (protected) — требует валидной NextAuth-сессии.
 */

import { requireAuth } from '@backend/lib/auth';
import { userRepository } from '@backend/users/repository';

export async function GET() {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const user = await userRepository.findById(auth.user.id);

    if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(user);
}
