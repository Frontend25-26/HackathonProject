import { z } from 'zod'

import { registry } from '@backend/lib/openapi'
import { addAccessTag } from '@backend/lib/openapi-security'

export const AssignmentSchema = registry.register(
    'Assignment',
    z.object({
        id: z.number().int(),
        title: z.string(),
        description: z.string(),
        classroomUrl: z.string(),
        maxGrade: z.number().int(),
        dueDate: z.string().datetime(),
        courseId: z.number().int(),
        createdById: z.number().int(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    }),
)

export const CreateAssignmentSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    classroomUrl: z.string().url(),
    maxGrade: z.number().int().min(1),
    dueDate: z.string().datetime(),
    courseId: z.number().int(),
    createdById: z.number().int(),
})

export const UpdateAssignmentSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    classroomUrl: z.string().url().optional(),
    maxGrade: z.number().int().min(1).optional(),
    dueDate: z.string().datetime().optional(),
})

registry.registerPath({
    method: 'get',
    path: '/assignments',
    tags: ['Assignments'],
    summary: addAccessTag(
        'Список заданий (фильтр по courseId через query)',
        'STUDENT',
    ),
    request: {
        query: z.object({ courseId: z.string().optional() }),
    },
    responses: {
        200: {
            description: 'Список заданий',
            content: {
                'application/json': { schema: z.array(AssignmentSchema) },
            },
        },
    },
})

registry.registerPath({
    method: 'post',
    path: '/assignments',
    tags: ['Assignments'],
    summary: addAccessTag('Создать задание', 'ADMIN'),
    request: {
        body: {
            content: { 'application/json': { schema: CreateAssignmentSchema } },
        },
    },
    responses: {
        201: {
            description: 'Задание создано',
            content: { 'application/json': { schema: AssignmentSchema } },
        },
    },
})

registry.registerPath({
    method: 'get',
    path: '/assignments/{id}',
    tags: ['Assignments'],
    summary: addAccessTag('Получить задание по ID', 'STUDENT'),
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Задание',
            content: { 'application/json': { schema: AssignmentSchema } },
        },
        404: { description: 'Задание не найдено' },
    },
})

registry.registerPath({
    method: 'patch',
    path: '/assignments/{id}',
    tags: ['Assignments'],
    summary: addAccessTag('Обновить задание', 'ADMIN'),
    request: {
        params: z.object({ id: z.string() }),
        body: {
            content: { 'application/json': { schema: UpdateAssignmentSchema } },
        },
    },
    responses: {
        200: {
            description: 'Обновлённое задание',
            content: { 'application/json': { schema: AssignmentSchema } },
        },
        404: { description: 'Задание не найдено' },
    },
})

registry.registerPath({
    method: 'delete',
    path: '/assignments/{id}',
    tags: ['Assignments'],
    summary: addAccessTag('Удалить задание', 'ADMIN'),
    request: { params: z.object({ id: z.string() }) },
    responses: {
        204: { description: 'Задание удалено' },
        404: { description: 'Задание не найдено' },
    },
})
