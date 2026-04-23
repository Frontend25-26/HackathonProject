import { z } from 'zod';

import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';

export const UserSchema = registry.register(
    'User',
    z.object({
        id: z.number().int(),
        githubId: z.number().int(),
        login: z.string(),
        name: z.string().nullable(),
        email: z.string().nullable(),
        avatar: z.string().nullable(),
        role: z.enum(['STUDENT', 'MENTOR', 'ADMIN']),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    }),
);

export const CreateUserSchema = z.object({
    githubId: z.number().int(),
    login: z.string(),
    name: z.string().optional(),
    email: z.string().optional(),
    avatar: z.string().optional(),
    role: z.enum(['STUDENT', 'MENTOR', 'ADMIN']).optional(),
});

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    avatar: z.string().optional(),
    role: z.enum(['STUDENT', 'MENTOR', 'ADMIN']).optional(),
});

registry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['Users'],
    summary: addAccessTag('Получить список всех пользователей', 'ADMIN'),
    description:
        'Только администраторы могут получить список всех пользователей.',
    security: [{ Authorization: [] }],
    responses: {
        200: {
            description: 'Список пользователей',
            content: { 'application/json': { schema: z.array(UserSchema) } },
        },
        401: { description: 'Не аутентифицирован' },
        403: { description: 'Требуется роль ADMIN' },
    },
});

registry.registerPath({
    method: 'post',
    path: '/users',
    tags: ['Users'],
    summary: addAccessTag('Создать пользователя (Auth.js callback)', 'PUBLIC'),
    description:
        'Вызывается автоматически Auth.js при первом логине через GitHub. ' +
        'Создаёт новую запись пользователя в БД и синхронизирует роль из GitHub Teams.',
    request: {
        body: { content: { 'application/json': { schema: CreateUserSchema } } },
    },
    responses: {
        201: {
            description: 'Пользователь создан',
            content: { 'application/json': { schema: UserSchema } },
        },
        409: { description: 'Пользователь с таким githubId уже существует' },
    },
});

registry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['Users'],
    summary: addAccessTag('Получить профиль пользователя по ID', 'ADMIN'),
    description:
        'Получить полный профиль пользователя. ' +
        'Только администраторы могут получить любого пользователя. ' +
        'Для своего профиля используйте GET /me.',
    security: [{ Authorization: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Пользователь',
            content: { 'application/json': { schema: UserSchema } },
        },
        401: { description: 'Не аутентифицирован' },
        403: { description: 'Требуется роль ADMIN' },
        404: { description: 'Пользователь не найден' },
    },
});

registry.registerPath({
    method: 'patch',
    path: '/users/{id}',
    tags: ['Users'],
    summary: addAccessTag('Обновить профиль пользователя', 'STUDENT'),
    description:
        'Обновить информацию пользователя (имя, email, аватар). ' +
        'Студент может обновить только свой профиль. ' +
        'ADMIN может обновить любого пользователя, включая изменение роли.',
    security: [{ Authorization: [] }],
    request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: UpdateUserSchema } } },
    },
    responses: {
        200: {
            description: 'Обновлённый пользователь',
            content: { 'application/json': { schema: UserSchema } },
        },
        401: { description: 'Не аутентифицирован' },
        403: {
            description:
                'Нет прав: чужой профиль или попытка изменить роль без ADMIN',
        },
        404: { description: 'Пользователь не найден' },
    },
});
