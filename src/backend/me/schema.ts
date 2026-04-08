import { registry } from '@backend/lib/openapi'
import { UserSchema } from '@backend/users/schema'

registry.registerPath({
    method: 'get',
    path: '/me',
    tags: ['Me'],
    summary: 'Получить текущего пользователя и его роль',
    description:
        'Возвращает профиль текущего пользователя с ролью (STUDENT, MENTOR, ADMIN). ' +
        'В dev-режиме возвращает первого пользователя из БД. ' +
        'В prod требует Auth.js и валидной сессии.',
    responses: {
        200: {
            description: 'Текущий пользователь',
            content: { 'application/json': { schema: UserSchema } },
        },
        401: { description: 'Не аутентифицирован' },
        404: { description: 'Пользователь не найден' },
    },
})
