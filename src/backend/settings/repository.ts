import { prisma } from '@backend/lib/prisma';

const CLASSROOM_ID_KEY = 'selectedClassroomId';

class SettingsRepository {
    async get(key: string): Promise<string | null> {
        const row = await prisma.siteSettings.findUnique({ where: { key } });
        return row?.value ?? null;
    }

    async set(key: string, value: string | null): Promise<void> {
        await prisma.siteSettings.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    async getClassroomId(): Promise<number | null> {
        const raw = await this.get(CLASSROOM_ID_KEY);
        if (!raw) return null;
        const parsed = parseInt(raw, 10);
        return isNaN(parsed) ? null : parsed;
    }

    async setClassroomId(id: number | null): Promise<void> {
        await this.set(CLASSROOM_ID_KEY, id !== null ? String(id) : null);
    }
}

export const settingsRepository = new SettingsRepository();
