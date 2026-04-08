import { z } from 'zod'

import '@backend/users/schema'
import '@backend/me/schema'
import '@backend/courses/schema'
import '@backend/enrollments/schema'
import '@backend/assignments/schema'
import '@backend/submissions/schema'
import '@backend/reviews/schema'
import '@backend/review-threads/schema'
import '@backend/review-comments/schema'
import '@backend/github/schema'

import { registry } from './openapi'
import { registerMockRoutes } from './openapi-mocks'

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
