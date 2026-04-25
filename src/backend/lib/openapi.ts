import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
    extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export function generateOpenApiSpec() {
    const generator = new OpenApiGeneratorV3(registry.definitions);

    const spec = generator.generateDocument({
        openapi: '3.0.0',
        info: {
            title: 'Hackathon API',
            version: '1.0.0',
            description:
                '## Авторизация\n\n' +
                '1. Войди через GitHub на `/login` — NextAuth положит сессионную cookie.\n' +
                '2. Все запросы из браузера и из серверных компонентов автоматически передают cookies.\n' +
                '3. В Swagger UI сессия не нужна — он всё равно работает в том же origin, и cookies подтянутся при "Try it out".\n',
        },
        servers: [{ url: '/api' }],
    });

    if (!spec.components) spec.components = {};
    if (!spec.components.securitySchemes) spec.components.securitySchemes = {};

    spec.components.securitySchemes.cookieAuth = {
        type: 'apiKey' as const,
        in: 'cookie' as const,
        name: 'authjs.session-token',
        description: 'NextAuth JWT-сессия в cookie',
    };

    return spec;
}
