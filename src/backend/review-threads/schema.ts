import { z } from 'zod'

import { registry } from '@backend/lib/openapi'

export const ReviewThreadSchema = registry.register(
    'ReviewThread',
    z.object({
        id: z.number().int(),
        filePath: z.string(),
        line: z.number().int(),
        reviewId: z.number().int(),
        createdAt: z.string().datetime(),
    }),
)

export const CreateReviewThreadSchema = z.object({
    filePath: z.string().min(1),
    line: z.number().int().min(1),
    reviewId: z.number().int(),
})

registry.registerPath({
    method: 'get',
    path: '/review-threads',
    tags: ['ReviewThreads'],
    summary: 'Список тредов ревью (фильтр по reviewId через query)',
    request: {
        query: z.object({ reviewId: z.string().optional() }),
    },
    responses: {
        200: {
            description: 'Список тредов (аналог PR review comments на GitHub)',
            content: {
                'application/json': { schema: z.array(ReviewThreadSchema) },
            },
        },
    },
})

registry.registerPath({
    method: 'post',
    path: '/review-threads',
    tags: ['ReviewThreads'],
    summary: 'Создать тред к файлу/строке (аналог PR review comment на GitHub)',
    request: {
        body: {
            content: {
                'application/json': { schema: CreateReviewThreadSchema },
            },
        },
    },
    responses: {
        201: {
            description: 'Тред создан',
            content: { 'application/json': { schema: ReviewThreadSchema } },
        },
    },
})

registry.registerPath({
    method: 'get',
    path: '/review-threads/{id}',
    tags: ['ReviewThreads'],
    summary: 'Получить тред по ID',
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Тред',
            content: { 'application/json': { schema: ReviewThreadSchema } },
        },
        404: { description: 'Тред не найден' },
    },
})

registry.registerPath({
    method: 'delete',
    path: '/review-threads/{id}',
    tags: ['ReviewThreads'],
    summary: 'Удалить тред',
    request: { params: z.object({ id: z.string() }) },
    responses: {
        204: { description: 'Тред удалён' },
        404: { description: 'Тред не найден' },
    },
})
