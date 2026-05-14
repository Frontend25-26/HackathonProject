import { z } from 'zod';

import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';

const GhOrganizationSchema = z.object({
    login: z.string(),
    avatar_url: z.string(),
});

export const GhClassroomSchema = registry.register(
    'GhClassroom',
    z.object({
        id: z.number().int(),
        name: z.string(),
        archived: z.boolean(),
        url: z.string(),
        organization: GhOrganizationSchema,
    }),
);

export const GhAssignmentSchema = registry.register(
    'GhAssignment',
    z.object({
        id: z.number().int(),
        title: z.string(),
        type: z.string(),
        invite_link: z.string(),
        deadline: z.string().nullable(),
        classroom: z.object({
            id: z.number().int(),
            name: z.string(),
            url: z.string(),
        }),
        accepted: z.number().int(),
        submissions_count: z.number().int(),
        passing: z.number().int(),
        failing: z.number().int(),
    }),
);

export const GhAcceptedAssignmentSchema = registry.register(
    'GhAcceptedAssignment',
    z.object({
        id: z.number().int(),
        submitted: z.boolean(),
        passing: z.boolean(),
        commit_count: z.number().int(),
        grade: z.string(),
        students: z.array(
            z.object({ login: z.string(), id: z.number().int() }),
        ),
        repository: z.object({
            id: z.number().int(),
            full_name: z.string(),
            html_url: z.string(),
            default_branch: z.string(),
        }),
        assignment: z.object({
            id: z.number().int(),
            title: z.string(),
        }),
    }),
);

export const SyncResultSchema = registry.register(
    'SyncResult',
    z.object({
        ok: z.boolean(),
        synced: z.number().int().openapi({
            description: 'Количество синхронизированных submissions',
        }),
    }),
);

// ─── GitHub Classroom ────────────────────────────────────────────────────────

registry.registerPath({
    method: 'get',
    path: '/github/classrooms',
    tags: ['GitHub Classroom'],
    summary: addAccessTag('Список classroom-классов организации', 'ADMIN'),
    responses: {
        200: {
            description: 'Список классрумов',
            content: {
                'application/json': { schema: z.array(GhClassroomSchema) },
            },
        },
    },
});

registry.registerPath({
    method: 'get',
    path: '/github/classrooms/{classroomId}/assignments',
    tags: ['GitHub Classroom'],
    summary: addAccessTag('Список заданий classroom-класса', 'ADMIN'),
    request: { params: z.object({ classroomId: z.string() }) },
    responses: {
        200: {
            description:
                'Список заданий Classroom (используй id для привязки к платформенному заданию)',
            content: {
                'application/json': { schema: z.array(GhAssignmentSchema) },
            },
        },
    },
});

registry.registerPath({
    method: 'get',
    path: '/github/assignments/{assignmentId}',
    tags: ['GitHub Classroom'],
    summary: addAccessTag(
        'Получить задание по ID (включает invite_link)',
        'ADMIN',
    ),
    request: { params: z.object({ assignmentId: z.string() }) },
    responses: {
        200: {
            description: 'Задание GitHub Classroom',
            content: { 'application/json': { schema: GhAssignmentSchema } },
        },
    },
});

registry.registerPath({
    method: 'get',
    path: '/github/assignments/{assignmentId}/accepted_assignments',
    tags: ['GitHub Classroom'],
    summary: addAccessTag(
        'Список принятых заданий студентами (репозитории)',
        'ADMIN',
    ),
    request: { params: z.object({ assignmentId: z.string() }) },
    responses: {
        200: {
            description: 'Список принятых заданий с репозиториями студентов',
            content: {
                'application/json': {
                    schema: z.array(GhAcceptedAssignmentSchema),
                },
            },
        },
    },
});

// ─── Синхронизация ────────────────────────────────────────────────────────────

registry.registerPath({
    method: 'post',
    path: '/github/sync/{assignmentId}',
    tags: ['GitHub Sync'],
    summary: addAccessTag(
        'Ручной триггер синхронизации: репозитории студентов + коммиты + PR-комментарии',
        'ADMIN',
    ),
    request: { params: z.object({ assignmentId: z.string() }) },
    responses: {
        200: {
            description: 'Синхронизация запущена и завершена',
            content: { 'application/json': { schema: SyncResultSchema } },
        },
        404: { description: 'Задание не найдено' },
    },
});

// ─── Webhooks ─────────────────────────────────────────────────────────────────

registry.registerPath({
    method: 'post',
    path: '/github/webhooks',
    tags: ['GitHub Sync'],
    summary:
        '[PUBLIC] Webhook от GitHub (push / pull_request / check_run / pull_request_review_comment / repository)',
    request: {
        headers: z.object({
            'x-github-event': z.string().openapi({
                description:
                    'Тип события: push | pull_request | check_run | pull_request_review_comment | repository',
                example: 'push',
            }),
            'x-hub-signature-256': z.string().optional().openapi({
                description:
                    'HMAC-SHA256 подпись тела запроса (обязательна если задан GITHUB_WEBHOOK_SECRET)',
            }),
        }),
    },
    responses: {
        200: {
            description: 'Событие принято и обработано',
            content: {
                'application/json': {
                    schema: z.object({ ok: z.boolean() }),
                },
            },
        },
        401: { description: 'Невалидная подпись webhook-а' },
    },
});
