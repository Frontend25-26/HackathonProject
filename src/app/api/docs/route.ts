import { generateOpenApiSpec } from '@backend/lib/openapi-spec'

export async function GET() {
    return Response.json(generateOpenApiSpec())
}
