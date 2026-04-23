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

registry.registerPath({
    method: 'get',
    path: '/github/classrooms/{classroomId}/assignments',
    tags: ['GitHub Classroom'],
    summary: addAccessTag('Список заданий classroom-класса', 'ADMIN'),
    request: { params: z.object({ classroomId: z.string() }) },
    responses: {
        200: {
            description: 'Список заданий',
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
