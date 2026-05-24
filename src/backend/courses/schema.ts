import { z } from 'zod';

import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';

export const CourseSchema = registry.register(
    'Course',
    z.object({
        id: z.number().int(),
        title: z.string(),
        description: z.string().nullable(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
        assignmentsTotal: z.number().int(),
        assignmentsCompleted: z.number().int(),
        totalScore: z.number().int(),
        maxScore: z.number().int(),
    }),
);

export const CreateCourseSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
});

export const UpdateCourseSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
});

registry.registerPath({
    method: 'get',
    path: '/courses',
    tags: ['Courses'],
    summary: addAccessTag('Список курсов', 'STUDENT'),
    responses: {
        200: {
            description: 'Список курсов',
            content: { 'application/json': { schema: z.array(CourseSchema) } },
        },
    },
});

registry.registerPath({
    method: 'post',
    path: '/courses',
    tags: ['Courses'],
    summary: addAccessTag('Создать курс', 'ADMIN'),
    request: {
        body: {
            content: { 'application/json': { schema: CreateCourseSchema } },
        },
    },
    responses: {
        201: {
            description: 'Курс создан',
            content: { 'application/json': { schema: CourseSchema } },
        },
    },
});

registry.registerPath({
    method: 'get',
    path: '/courses/{id}',
    tags: ['Courses'],
    summary: addAccessTag('Получить курс по ID', 'STUDENT'),
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Курс',
            content: { 'application/json': { schema: CourseSchema } },
        },
        404: { description: 'Курс не найден' },
    },
});

registry.registerPath({
    method: 'patch',
    path: '/courses/{id}',
    tags: ['Courses'],
    summary: addAccessTag('Обновить курс', 'ADMIN'),
    request: {
        params: z.object({ id: z.string() }),
        body: {
            content: { 'application/json': { schema: UpdateCourseSchema } },
        },
    },
    responses: {
        200: {
            description: 'Обновлённый курс',
            content: { 'application/json': { schema: CourseSchema } },
        },
        404: { description: 'Курс не найден' },
    },
});

registry.registerPath({
    method: 'delete',
    path: '/courses/{id}',
    tags: ['Courses'],
    summary: addAccessTag('Удалить курс', 'ADMIN'),
    request: { params: z.object({ id: z.string() }) },
    responses: {
        204: { description: 'Курс удалён' },
        404: { description: 'Курс не найден' },
    },
});
