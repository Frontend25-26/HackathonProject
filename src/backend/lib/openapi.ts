import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
    extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export function generateOpenApiSpec() {
    const isDevMode = process.env.USE_MOCKS === 'true';
    const generator = new OpenApiGeneratorV3(registry.definitions);

    const spec = generator.generateDocument({
        openapi: '3.0.0',
        info: {
            title: `Hackathon API — ${isDevMode ? 'MOCKS' : 'DB'}`,
            version: '1.0.0',
            description:
                '## Авторизация\n\n' +
                (isDevMode
                    ? '### DEV режим (USE_MOCKS=true):\n' +
                      '1. Нажми **"Authorize"** (сверху справа)\n' +
                      '2. В поле **"Value"** введи роль пользователя:\n' +
                      '   - **STUDENT** — обычный студент\n\n' +
                      '   - **MENTOR** — ментор проекта\n\n' +
                      '   - **ADMIN** — администратор\n\n' +
                      '3. Нажми **"Authorize"** и закрой диалог\n' +
                      '4. Все запросы будут включать заголовок `x-mock-user-id`\n\n'
                    : '### PROD режим (БД + Auth.js):\n' +
                      '1. Нажми **"Authorize"** (сверху справа)\n' +
                      '2. Введи **JWT token** после логина через GitHub\n' +
                      '3. Нажми **"Authorize"** и закрой диалог\n' +
                      '4. Все запросы будут включать заголовок `Authorization: Bearer <token>`\n\n' +
                      '**Пример:** `Authorization: Bearer eyJhbGc...`\n'),
        },
        servers: [{ url: '/api' }],
    });

    // Добавляем security schemes вручную
    if (!spec.components) {
        spec.components = {};
    }
    if (!spec.components.securitySchemes) {
        spec.components.securitySchemes = {};
    }

    // В зависимости от режима добавляем разные схемы авторизации
    if (isDevMode) {
        // DEV режим: apiKey с ролями вместо ID
        spec.components.securitySchemes.Authorization = {
            type: 'apiKey' as const,
            in: 'header' as const,
            name: 'x-mock-user-id',
            description:
                '**Выбери роль:**\n' +
                '- **STUDENT** — студент (доступ к /api/me, /api/courses)\n' +
                '- **MENTOR** — ментор проекта (доступ к /api/reviews)\n' +
                '- **ADMIN** — администратор (доступ к /api/users)',
        };
    } else {
        // PROD режим: Bearer token
        spec.components.securitySchemes.Authorization = {
            type: 'http' as const,
            scheme: 'bearer' as const,
            bearerFormat: 'JWT',
            description:
                'Bearer token с информацией о пользователе и его роли (Auth.js)',
        };
    }

    return spec;
}
