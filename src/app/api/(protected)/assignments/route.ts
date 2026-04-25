/**
 * GET  /api/assignments — список заданий (фильтр по courseId)
 * POST /api/assignments — создать задание
 *
 * GET доступен любому аутентифицированному пользователю.
 * POST требует роль ADMIN.
 */

import { NextRequest } from 'next/server';

import { assignmentRepository } from '@backend/assignments/repository';
import { CreateAssignmentSchema } from '@backend/assignments/schema';
import { requireAuth, requireAdmin } from '@backend/lib/auth';

export async function GET(request: NextRequest) {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { searchParams } = request.nextUrl;
    const courseId = searchParams.get('courseId');

    const assignments = await assignmentRepository.findAll(
        courseId ? { courseId: Number(courseId) } : undefined,
    );

    return Response.json(assignments);
}

export async function POST(request: NextRequest) {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body: unknown = await request.json();
    const parsed = CreateAssignmentSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 });
    }

    const assignment = await assignmentRepository.create({
        ...parsed.data,
        dueDate: new Date(parsed.data.dueDate),
    });

    return Response.json(assignment, { status: 201 });
}
