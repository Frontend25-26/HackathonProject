import { NextRequest } from 'next/server';

import { requireAdmin } from '@backend/lib/auth';
import { syncLogRepository } from '@backend/sync-logs/repository';

export const GET = async (request: NextRequest): Promise<Response> => {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { searchParams } = request.nextUrl;
    const entityType = searchParams.get('entityType') ?? undefined;
    const entityIdRaw = searchParams.get('entityId');
    const limitRaw = searchParams.get('limit');

    const logs = await syncLogRepository.findAll({
        entityType,
        entityId: entityIdRaw ? Number(entityIdRaw) : undefined,
        limit: limitRaw ? Number(limitRaw) : 100,
    });

    return Response.json(logs);
};
