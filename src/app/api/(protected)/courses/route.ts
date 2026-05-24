/**
 * GET  /api/courses — список курсов
 * POST /api/courses — создать курс
 *
 * Группа: (protected) — GET доступен любому аутентифицированному пользователю.
 * POST требует роль ADMIN.
 */

import { NextRequest } from 'next/server';

import { courseRepository } from '@backend/courses/repository';
import { CreateCourseSchema } from '@backend/courses/schema';
import { requireAuth, requireAdmin } from '@backend/lib/auth';

export const GET = async (): Promise<Response> => {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const courses = await courseRepository.findAllWithStats(auth.user.id);
    return Response.json(courses);
};

export const POST = async (request: NextRequest): Promise<Response> => {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body: unknown = await request.json();
    const parsed = CreateCourseSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 });
    }

    const course = await courseRepository.create(parsed.data);
    return Response.json(course, { status: 201 });
};
