/**
 * GET /api/docs — OpenAPI спецификация
 *
 * Группа: (public) — авторизация не требуется.
 */

import { generateOpenApiSpec } from '@backend/lib/openapi-spec'

export async function GET() {
    return Response.json(generateOpenApiSpec())
}
