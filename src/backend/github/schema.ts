import { z } from 'zod'

import { registry } from '@backend/lib/openapi'

const GhOrganizationSchema = z.object({
    login: z.string(),
    avatar_url: z.string(),
})

export const GhClassroomSchema = registry.register(
    'GhClassroom',
    z.object({
        id: z.number().int(),
        name: z.string(),
        archived: z.boolean(),
        url: z.string(),
        organization: GhOrganizationSchema,
    }),
)

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
)

registry.registerPath({
    method: 'get',
    path: '/github/classrooms',
    tags: ['GitHub Classroom'],
    summary: 'Список classroom-классов (требует GITHUB_TOKEN)',
    responses: {
        200: {
            description: 'Список классов',
            content: {
                'application/json': { schema: z.array(GhClassroomSchema) },
            },
        },
    },
})

registry.registerPath({
    method: 'get',
    path: '/github/classrooms/{classroomId}/assignments',
    tags: ['GitHub Classroom'],
    summary: 'Список заданий classroom-класса',
    request: { params: z.object({ classroomId: z.string() }) },
    responses: {
        200: {
            description: 'Список заданий',
            content: {
                'application/json': { schema: z.array(GhAssignmentSchema) },
            },
        },
    },
})

registry.registerPath({
    method: 'get',
    path: '/github/assignments/{assignmentId}',
    tags: ['GitHub Classroom'],
    summary: 'Получить задание по ID (включает invite_link)',
    request: { params: z.object({ assignmentId: z.string() }) },
    responses: {
        200: {
            description: 'Задание GitHub Classroom',
            content: { 'application/json': { schema: GhAssignmentSchema } },
        },
    },
})
