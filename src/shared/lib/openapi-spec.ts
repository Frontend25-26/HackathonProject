import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { registry } from './openapi'
import { registerMockRoutes } from './openapi-mocks'

extendZodWithOpenApi(z)

registry.registerPath({
    method: 'get',
    path: '/docs',
    summary: 'OpenAPI specification',
    tags: ['System'],
    responses: {
        200: {
            description: 'OpenAPI JSON spec',
            content: {
                'application/json': {
                    schema: z
                        .object({})
                        .openapi({ description: 'OpenAPI 3.0 document' }),
                },
            },
        },
    },
})

// TODO: выпилить при выпиливании моков (src/mocks/)
registerMockRoutes()

export { generateOpenApiSpec } from './openapi'
