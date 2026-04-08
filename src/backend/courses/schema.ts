import { z } from 'zod'

import { registry } from '@backend/lib/openapi'

export const CourseSchema = registry.register(
    'Course',
    z.object({
        id: z.number().int(),
        title: z.string(),
        description: z.string().nullable(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    }),
)

export const CreateCourseSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
})

export const UpdateCourseSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
})

registry.registerPath({
    method: 'get',
    path: '/courses',
    tags: ['Courses'],
    summary: 'Список курсов',
    responses: {
        200: {
            description: 'Список курсов',
            content: { 'application/json': { schema: z.array(CourseSchema) } },
        },
    },
})

registry.registerPath({
    method: 'post',
    path: '/courses',
    tags: ['Courses'],
    summary: 'Создать курс',
    request: {
        body: { content: { 'application/json': { schema: CreateCourseSchema } } },
    },
    responses: {
        201: {
            description: 'Курс создан',
            content: { 'application/json': { schema: CourseSchema } },
        },
    },
})

registry.registerPath({
    method: 'get',
    path: '/courses/{id}',
    tags: ['Courses'],
    summary: 'Получить курс по ID',
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Курс',
            content: { 'application/json': { schema: CourseSchema } },
        },
        404: { description: 'Курс не найден' },
    },
})

registry.registerPath({
    method: 'patch',
    path: '/courses/{id}',
    tags: ['Courses'],
    summary: 'Обновить курс',
    request: {
        params: z.object({ id: z.string() }),
        body: { content: { 'application/json': { schema: UpdateCourseSchema } } },
    },
    responses: {
        200: {
            description: 'Обновлённый курс',
            content: { 'application/json': { schema: CourseSchema } },
        },
        404: { description: 'Курс не найден' },
    },
})

registry.registerPath({
    method: 'delete',
    path: '/courses/{id}',
    tags: ['Courses'],
    summary: 'Удалить курс',
    request: { params: z.object({ id: z.string() }) },
    responses: {
        204: { description: 'Курс удалён' },
        404: { description: 'Курс не найден' },
    },
})
