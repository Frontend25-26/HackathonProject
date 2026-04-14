import { z } from 'zod'

import { registry } from '@backend/lib/openapi'
import { addAccessTag } from '@backend/lib/openapi-security'

export const ReviewSchema = registry.register(
    'Review',
    z.object({
        id: z.number().int(),
        grade: z.number().int(),
        generalComment: z.string().nullable(),
        submissionId: z.number().int(),
        mentorId: z.number().int(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    }),
)

export const CreateReviewSchema = z.object({
    grade: z.number().int().min(0),
    generalComment: z.string().optional(),
    submissionId: z.number().int(),
    mentorId: z.number().int(),
})

export const UpdateReviewSchema = z.object({
    grade: z.number().int().min(0).optional(),
    generalComment: z.string().optional(),
})

registry.registerPath({
    method: 'get',
    path: '/reviews',
    tags: ['Reviews'],
    summary: addAccessTag('Список ревью (фильтр по submissionId через query)', 'MENTOR'),
    request: {
        query: z.object({ submissionId: z.string().optional() }),
    },
    responses: {
        200: {
            description: 'Список ревью',
            content: { 'application/json': { schema: z.array(ReviewSchema) } },
        },
    },
})

registry.registerPath({
    method: 'post',
    path: '/reviews',
    tags: ['Reviews'],
    summary: addAccessTag('Создать ревью', 'MENTOR'),
    request: {
        body: {
            content: { 'application/json': { schema: CreateReviewSchema } },
        },
    },
    responses: {
        201: {
            description: 'Ревью создано',
            content: { 'application/json': { schema: ReviewSchema } },
        },
        409: { description: 'Ревью для этой работы уже существует' },
    },
})

registry.registerPath({
    method: 'get',
    path: '/reviews/{id}',
    tags: ['Reviews'],
    summary: addAccessTag('Получить ревью по ID', 'MENTOR'),
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Ревью',
            content: { 'application/json': { schema: ReviewSchema } },
        },
        404: { description: 'Ревью не найдено' },
    },
})

registry.registerPath({
    method: 'patch',
    path: '/reviews/{id}',
    tags: ['Reviews'],
    summary: addAccessTag('Обновить ревью', 'MENTOR'),
    request: {
        params: z.object({ id: z.string() }),
        body: {
            content: { 'application/json': { schema: UpdateReviewSchema } },
        },
    },
    responses: {
        200: {
            description: 'Обновлённое ревью',
            content: { 'application/json': { schema: ReviewSchema } },
        },
        404: { description: 'Ревью не найдено' },
    },
})
