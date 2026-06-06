import { z } from 'zod';

import { registry } from '@backend/lib/openapi';
import { addAccessTag } from '@backend/lib/openapi-security';

export const NotificationSchema = registry.register(
    'Notification',
    z.object({
        id: z.number().int(),
        userId: z.number().int(),
        title: z.string(),
        body: z.string().nullable(),
        link: z.string().nullable(),
        isRead: z.boolean(),
        createdAt: z.string().datetime(),
        source: z
            .object({
                authorId: z.number().int(),
                userName: z.string(),
                imgUrl: z.string().nullable(),
            })
            .nullable(),
    }),
);

const CountSchema = z.object({ count: z.number().int() });

registry.registerPath({
    method: 'get',
    path: '/notifications',
    tags: ['Notifications'],
    summary: addAccessTag(
        'Список уведомлений текущего пользователя',
        'STUDENT',
    ),
    request: {
        query: z.object({
            unread: z.string().optional(),
            limit: z.string().optional(),
        }),
    },
    responses: {
        200: {
            description: 'Список уведомлений',
            content: {
                'application/json': { schema: z.array(NotificationSchema) },
            },
        },
    },
});

registry.registerPath({
    method: 'patch',
    path: '/notifications/{id}/read',
    tags: ['Notifications'],
    summary: addAccessTag('Отметить уведомление как прочитанное', 'STUDENT'),
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: 'Уведомление обновлено',
            content: { 'application/json': { schema: NotificationSchema } },
        },
        404: { description: 'Уведомление не найдено' },
    },
});

registry.registerPath({
    method: 'post',
    path: '/notifications/read-all',
    tags: ['Notifications'],
    summary: addAccessTag(
        'Отметить все уведомления как прочитанные',
        'STUDENT',
    ),
    responses: {
        200: {
            description: 'Количество обновлённых уведомлений',
            content: { 'application/json': { schema: CountSchema } },
        },
    },
});
