import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';
import { UserSchema } from '@backend/users/schema';

registry.registerPath({
    method: 'get',
    path: '/me',
    tags: ['Me'],
    summary: addAccessTag('Получить профиль текущего пользователя', 'STUDENT'),
    description:
        'Возвращает профиль текущего пользователя с ролью (STUDENT, MENTOR, ADMIN). ' +
        'Требует валидной NextAuth-сессии (cookie).',
    security: [{ Authorization: [] }],
    responses: {
        200: {
            description: 'Текущий пользователь',
            content: { 'application/json': { schema: UserSchema } },
        },
        401: { description: 'Не аутентифицирован' },
        404: { description: 'Пользователь не найден' },
    },
});
