import { prisma } from '@backend/lib/prisma';
import { SyncLog } from '@backend/generated/prisma';

class SyncLogRepository {
    async findAll(filters?: {
        entityType?: string;
        entityId?: number;
        limit?: number;
    }): Promise<SyncLog[]> {
        return prisma.syncLog.findMany({
            where: {
                ...(filters?.entityType && { entityType: filters.entityType }),
                ...(filters?.entityId !== undefined && {
                    entityId: filters.entityId,
                }),
            },
            orderBy: { createdAt: 'desc' },
            take: filters?.limit ?? 100,
        });
    }

    async create(data: {
        entityType: string;
        entityId?: number;
        action: string;
        success: boolean;
        errorMessage?: string;
        rateLimitRemaining?: number;
    }): Promise<SyncLog> {
        return prisma.syncLog.create({ data });
    }
}

export const syncLogRepository = new SyncLogRepository();
