import { generateOpenApiSpec } from '@/shared/lib/openapi-spec'

export async function GET() {
    return Response.json(generateOpenApiSpec())
}
