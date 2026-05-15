import { z } from 'zod';

import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';

export const SyncLogSchema = registry.register(
    'SyncLog',
    z.object({
        id: z.number().int(),
        entityType: z.string(),
        entityId: z.number().int().nullable(),
        action: z.string(),
        success: z.boolean(),
        errorMessage: z.string().nullable(),
        rateLimitRemaining: z.number().int().nullable(),
        createdAt: z.string().datetime(),
    }),
);

registry.registerPath({
    method: 'get',
    path: '/sync-logs',
    tags: ['SyncLogs'],
    summary: addAccessTag('Журнал синхронизаций с GitHub', 'ADMIN'),
    request: {
        query: z.object({
            entityType: z.string().optional(),
            entityId: z.string().optional(),
            limit: z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: 'Список записей журнала',
            content: {
                'application/json': { schema: z.array(SyncLogSchema) },
            },
        },
    },
});
