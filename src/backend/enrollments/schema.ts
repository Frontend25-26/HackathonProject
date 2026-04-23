import { z } from 'zod';

import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';

export const EnrollmentSchema = registry.register(
    'Enrollment',
    z.object({
        id: z.number().int(),
        courseId: z.number().int(),
        studentId: z.number().int(),
        mentorId: z.number().int().nullable(),
        createdAt: z.string().datetime(),
    }),
);

export const CreateEnrollmentSchema = z.object({
    courseId: z.number().int(),
    studentId: z.number().int(),
    mentorId: z.number().int().optional(),
});

registry.registerPath({
    method: 'get',
    path: '/enrollments',
    tags: ['Enrollments'],
    summary: addAccessTag(
        'Список зачислений (фильтр по courseId или studentId через query)',
        'STUDENT',
    ),
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
});

registry.registerPath({
    method: 'patch',
    path: '/enrollments/{id}',
    tags: ['Enrollments'],
    summary: addAccessTag('Назначить ментора студенту на курс', 'ADMIN'),
    request: {
        params: z.object({ id: z.string() }),
        body: {
            content: {
                'application/json': {
                    schema: z.object({ mentorId: z.number().int() }),
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Ментор назначен',
            content: { 'application/json': { schema: EnrollmentSchema } },
        },
        404: { description: 'Зачисление не найдено' },
    },
});
