import { z } from 'zod';

import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';

export const SiteSettingsSchema = registry.register(
    'SiteSettings',
    z.object({
        classroomId: z.number().int().nullable(),
    }),
);

export const UpdateSiteSettingsSchema = z.object({
    classroomId: z.number().int().nullable(),
});

registry.registerPath({
    method: 'get',
    path: '/settings',
    tags: ['Settings'],
    summary: addAccessTag('Глобальные настройки сайта', 'ADMIN'),
    responses: {
        200: {
            description: 'Настройки',
            content: { 'application/json': { schema: SiteSettingsSchema } },
        },
    },
});

registry.registerPath({
    method: 'patch',
    path: '/settings',
    tags: ['Settings'],
    summary: addAccessTag('Обновить настройки', 'ADMIN'),
    request: {
        body: {
            content: {
                'application/json': { schema: UpdateSiteSettingsSchema },
            },
        },
    },
    responses: {
        200: {
            description: 'Обновлённые настройки',
            content: { 'application/json': { schema: SiteSettingsSchema } },
        },
    },
});
