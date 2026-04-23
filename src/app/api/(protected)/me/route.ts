/**
 * GET /api/me — текущий пользователь и его роль
 *
 * Группа: (protected) — требует любой аутентифицированный пользователь.
 * Авторизация проверяется middleware в src/middleware.ts.
 *
 * Заголовки, проставленные middleware:
 *  x-user-id   — id текущего пользователя
 *  x-user-role — роль (STUDENT | MENTOR | ADMIN)
 *
 * TODO(#19): После подключения Auth.js убрать USE_MOCKS ветку,
 * т.к. middleware будет верифицировать реальную сессию.
 */

import { NextRequest } from 'next/server';

import { requireAuth } from '@backend/lib/auth';
import { userRepository } from '@backend/users/repository'; // используется в режиме БД

export async function GET(request: NextRequest) {
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response;

    const user = await userRepository.findById(auth.user.id);

    if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(user);
}
