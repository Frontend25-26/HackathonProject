import { z } from 'zod';

import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';

const SubmissionStudentSchema = z.object({
    id: z.number().int(),
    name: z.string().nullable(),
    login: z.string(),
    avatar: z.string().nullable(),
});

export const SubmissionSchema = registry.register(
    'Submission',
    z.object({
        id: z.number().int(),
        repoUrl: z.string(),
        ciStatus: z.enum([
            'UNKNOWN',
            'PENDING',
            'RUNNING',
            'SUCCESS',
            'FAILURE',
        ]),
        status: z.enum([
            'DRAFT',
            'PENDING',
            'IN_REVIEW',
            'CHANGES_REQUESTED',
            'APPROVED',
        ]),
        assignmentId: z.number().int(),
        studentId: z.number().int(),
        student: SubmissionStudentSchema,
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    }),
);

export const CreateSubmissionSchema = z.object({
    repoUrl: z.string().url(),
    assignmentId: z.number().int(),
    studentId: z.number().int(),
});

export const UpdateSubmissionSchema = z.object({
    repoUrl: z.string().url().optional(),
    ciStatus: z
        .enum(['UNKNOWN', 'PENDING', 'RUNNING', 'SUCCESS', 'FAILURE'])
        .optional(),
    status: z
        .enum([
            'DRAFT',
            'PENDING',
            'IN_REVIEW',
            'CHANGES_REQUESTED',
            'APPROVED',
        ])
        .optional(),
});

registry.registerPath({
    method: 'get',
    path: '/submissions',
    tags: ['Submissions'],
    summary: addAccessTag(
        'Список работ (фильтр по assignmentId или studentId через query)',
        'STUDENT',
    ),
    request: {
        query: z.object({
            assignmentId: z.string().optional(),
            studentId: z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: 'Список работ',
            content: {
                'application/json': { schema: z.array(SubmissionSchema) },
            },
        },
    },
});

registry.registerPath({
    method: 'post',
    path: '/submissions',
    tags: ['Submissions'],
    summary: addAccessTag('Отправить работу', 'STUDENT'),
    request: {
        body: {
            content: { 'application/json': { schema: CreateSubmissionSchema } },
        },
    },
    responses: {
        201: {
            description: 'Работа создана',
            content: { 'application/json': { schema: SubmissionSchema } },
        },
        409: { description: 'Студент уже сдал эту работу' },
    },
});

registry.registerPath({
    method: 'get',
    path: '/submissions/{id}',
    tags: ['Submissions'],
    summary: addAccessTag('Получить работу по ID', 'STUDENT'),
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Работа',
            content: { 'application/json': { schema: SubmissionSchema } },
        },
        404: { description: 'Работа не найдена' },
    },
});

registry.registerPath({
    method: 'patch',
    path: '/submissions/{id}',
    tags: ['Submissions'],
    summary: addAccessTag('Обновить статус / repoUrl работы', 'STUDENT'),
    request: {
        params: z.object({ id: z.string() }),
        body: {
            content: { 'application/json': { schema: UpdateSubmissionSchema } },
        },
    },
    responses: {
        200: {
            description: 'Обновлённая работа',
            content: { 'application/json': { schema: SubmissionSchema } },
        },
        404: { description: 'Работа не найдена' },
    },
});
