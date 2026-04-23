/**
 * GET /api/github/classrooms — список классрумов GitHub Classroom
 *
 * Группа: (admin) — требует роль ADMIN.
 */

import { NextRequest } from 'next/server';

import { classroomApi } from '@backend/github/classroom';
import { requireAdmin } from '@backend/lib/auth';

export async function GET(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        const classrooms = await classroomApi.listClassrooms();
        return Response.json(classrooms);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'GitHub API error';
        return Response.json({ error: message }, { status: 502 });
    }
}
