import { z } from 'zod'

import { registry } from '@backend/lib/openapi'

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
    summary: 'Список комментариев (фильтр по threadId через query)',
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
    summary: 'Добавить комментарий в тред',
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
    summary: 'Редактировать комментарий',
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
    summary: 'Удалить комментарий',
    request: { params: z.object({ id: z.string() }) },
    responses: {
        204: { description: 'Комментарий удалён' },
        404: { description: 'Комментарий не найден' },
    },
})
