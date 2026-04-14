import { z } from 'zod'

import { registry } from '@backend/lib/openapi'
import { addAccessTag } from '@backend/lib/openapi-security'

export const ReviewCommentSchema = registry.register(
    'ReviewComment',
    z.object({
        id: z.number().int(),
        body: z.string(),
        threadId: z.number().int(),
        authorId: z.number().int(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    }),
)

export const CreateReviewCommentSchema = z.object({
    body: z.string().min(1),
    threadId: z.number().int(),
    authorId: z.number().int(),
})

export const UpdateReviewCommentSchema = z.object({
    body: z.string().min(1),
})

registry.registerPath({
    method: 'get',
    path: '/review-comments',
    tags: ['ReviewComments'],
    summary: addAccessTag(
        'Список комментариев (фильтр по threadId через query)',
        'MENTOR',
    ),
    request: {
        query: z.object({ threadId: z.string().optional() }),
    },
    responses: {
        200: {
            description: 'Список комментариев',
            content: {
                'application/json': { schema: z.array(ReviewCommentSchema) },
            },
        },
    },
})

registry.registerPath({
    method: 'post',
    path: '/review-comments',
    tags: ['ReviewComments'],
    summary: addAccessTag('Добавить комментарий в тред', 'MENTOR'),
    request: {
        body: {
            content: {
                'application/json': { schema: CreateReviewCommentSchema },
            },
        },
    },
    responses: {
        201: {
            description: 'Комментарий создан',
            content: { 'application/json': { schema: ReviewCommentSchema } },
        },
    },
})

registry.registerPath({
    method: 'patch',
    path: '/review-comments/{id}',
    tags: ['ReviewComments'],
    summary: addAccessTag('Редактировать комментарий', 'MENTOR'),
    request: {
        params: z.object({ id: z.string() }),
        body: {
            content: {
                'application/json': { schema: UpdateReviewCommentSchema },
            },
        },
    },
    responses: {
        200: {
            description: 'Обновлённый комментарий',
            content: { 'application/json': { schema: ReviewCommentSchema } },
        },
        404: { description: 'Комментарий не найден' },
    },
})

registry.registerPath({
    method: 'delete',
    path: '/review-comments/{id}',
    tags: ['ReviewComments'],
    summary: addAccessTag('Удалить комментарий', 'MENTOR'),
    request: { params: z.object({ id: z.string() }) },
    responses: {
        204: { description: 'Комментарий удалён' },
        404: { description: 'Комментарий не найден' },
    },
})
