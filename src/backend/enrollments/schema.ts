import { z } from 'zod'

import { registry } from '@backend/lib/openapi'

export const EnrollmentSchema = registry.register(
    'Enrollment',
    z.object({
        id: z.number().int(),
        courseId: z.number().int(),
        studentId: z.number().int(),
        mentorId: z.number().int().nullable(),
        createdAt: z.string().datetime(),
    }),
)

export const CreateEnrollmentSchema = z.object({
    courseId: z.number().int(),
    studentId: z.number().int(),
    mentorId: z.number().int().optional(),
})

registry.registerPath({
    method: 'get',
    path: '/enrollments',
    tags: ['Enrollments'],
    summary: 'Список зачислений (фильтр по courseId или studentId через query)',
    request: {
        query: z.object({
            courseId: z.string().optional(),
            studentId: z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: 'Список зачислений',
            content: {
                'application/json': { schema: z.array(EnrollmentSchema) },
            },
        },
    },
})

registry.registerPath({
    method: 'post',
    path: '/enrollments',
    tags: ['Enrollments'],
    summary: 'Зачислить студента на курс',
    request: {
        body: {
            content: { 'application/json': { schema: CreateEnrollmentSchema } },
        },
    },
    responses: {
        201: {
            description: 'Зачисление создано',
            content: { 'application/json': { schema: EnrollmentSchema } },
        },
        409: { description: 'Студент уже зачислен на этот курс' },
    },
})

registry.registerPath({
    method: 'delete',
    path: '/enrollments/{id}',
    tags: ['Enrollments'],
    summary: 'Удалить зачисление',
    request: { params: z.object({ id: z.string() }) },
    responses: {
        204: { description: 'Зачисление удалено' },
        404: { description: 'Зачисление не найдено' },
    },
})
