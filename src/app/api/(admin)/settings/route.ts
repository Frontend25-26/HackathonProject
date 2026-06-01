import { settingsRepository } from '@backend/settings/repository';
import { UpdateSiteSettingsSchema } from '@backend/settings/schema';
import { NextRequest } from 'next/server';

import { requireAdmin } from '@backend/lib/auth';

export const GET = async (): Promise<Response> => {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const classroomId = await settingsRepository.getClassroomId();
    return Response.json({ classroomId });
};

export const PATCH = async (request: NextRequest): Promise<Response> => {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body: unknown = await request.json();
    const parsed = UpdateSiteSettingsSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 });
    }

    await settingsRepository.setClassroomId(parsed.data.classroomId);
    const classroomId = await settingsRepository.getClassroomId();
    return Response.json({ classroomId });
};
