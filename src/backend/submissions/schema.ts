import { z } from 'zod';

import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';

const SubmissionStudentSchema = z.object({
    id: z.number().int(),
    name: z.string().nullable(),
    login: z.string(),
    avatar: z.string().nullable(),
});

const CiStatusEnum = z.enum([
    'UNKNOWN',
    'PENDING',
    'RUNNING',
    'SUCCESS',
    'FAILURE',
]);

export const SubmissionSchema = registry.register(
    'Submission',
    z.object({
        id: z.number().int(),
        repoUrl: z.string(),
        repoOwner: z.string().nullable(),
        repoName: z.string().nullable(),
        prNumber: z.number().int().nullable(),
        ciStatus: CiStatusEnum,
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

export const CommitSchema = registry.register(
    'Commit',
    z.object({
        id: z.number().int(),
        sha: z.string(),
        message: z.string(),
        authorName: z.string(),
        authorLogin: z.string().nullable(),
        committedAt: z.string().datetime(),
        ciStatus: CiStatusEnum,
        ciDetailsUrl: z.string().nullable(),
        submissionId: z.number().int(),
    }),
);

export const DiffFileSchema = registry.register(
    'DiffFile',
    z.object({
        filename: z.string(),
        status: z.enum(['added', 'removed', 'modified', 'renamed']),
        additions: z.number().int(),
        deletions: z.number().int(),
        changes: z.number().int(),
        patch: z.string().optional(),
    }),
);

export const SubmissionDiffSchema = registry.register(
    'SubmissionDiff',
    z.object({
        prNumber: z.number().int(),
        files: z.array(DiffFileSchema),
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

registry.registerPath({
    method: 'get',
    path: '/submissions/{id}/commits',
    tags: ['Submissions'],
    summary: addAccessTag(
        'История коммитов работы (из кэша БД; ?refresh=1 — синхронизировать с GitHub)',
        'STUDENT',
    ),
    request: {
        params: z.object({ id: z.string() }),
        query: z.object({ refresh: z.enum(['1']).optional() }),
    },
    responses: {
        200: {
            description: 'Список коммитов, отсортированных от новых к старым',
            content: {
                'application/json': { schema: z.array(CommitSchema) },
            },
        },
        403: { description: 'Доступ к чужой работе запрещён' },
        404: { description: 'Работа не найдена' },
    },
});

registry.registerPath({
    method: 'get',
    path: '/submissions/{id}/diff',
    tags: ['Submissions'],
    summary: addAccessTag(
        'Diff изменённых файлов из Pull Request (реальные данные с GitHub)',
        'STUDENT',
    ),
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Список изменённых файлов с patch-фрагментами',
            content: {
                'application/json': { schema: SubmissionDiffSchema },
            },
        },
        403: { description: 'Доступ к чужой работе запрещён' },
        404: { description: 'Работа или Pull Request не найдены' },
    },
});
