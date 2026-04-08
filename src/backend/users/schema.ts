import { z } from 'zod'

import { registry } from '@backend/lib/openapi'

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
)

export const CreateUserSchema = z.object({
    githubId: z.number().int(),
    login: z.string(),
    name: z.string().optional(),
    email: z.string().optional(),
    avatar: z.string().optional(),
    role: z.enum(['STUDENT', 'MENTOR', 'ADMIN']).optional(),
})

export const UpdateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    avatar: z.string().optional(),
    role: z.enum(['STUDENT', 'MENTOR', 'ADMIN']).optional(),
})

registry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['Users'],
    summary: 'Список пользователей',
    responses: {
        200: {
            description: 'Список пользователей',
            content: { 'application/json': { schema: z.array(UserSchema) } },
        },
    },
})

registry.registerPath({
    method: 'post',
    path: '/users',
    tags: ['Users'],
    summary: 'Создать пользователя (вызывается Auth.js при OAuth)',
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
})

registry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Получить пользователя по ID',
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Пользователь',
            content: { 'application/json': { schema: UserSchema } },
        },
        404: { description: 'Пользователь не найден' },
    },
})

registry.registerPath({
    method: 'patch',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Обновить профиль пользователя',
    request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: UpdateUserSchema } } },
    },
    responses: {
        200: {
            description: 'Обновлённый пользователь',
            content: { 'application/json': { schema: UserSchema } },
        },
        404: { description: 'Пользователь не найден' },
    },
})
