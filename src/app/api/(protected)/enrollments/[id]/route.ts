/**
 * PATCH /api/enrollments/[id] — назначить ментора студенту на курс
 *
 * Группа: (protected) — требует роль ADMIN.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';

import { enrollmentRepository } from '@backend/enrollments/repository';
import { requireAdmin } from '@backend/lib/auth';

type Params = { params: Promise<{ id: string }> };

const UpdateEnrollmentSchema = z.object({
    mentorId: z.number().int(),
});

export async function PATCH(request: NextRequest, { params }: Params) {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const { id } = await params;

    const existing = await enrollmentRepository.findById(Number(id));
    if (!existing) {
        return Response.json(
            { error: 'Enrollment not found' },
            { status: 404 },
        );
    }

    const body: unknown = await request.json();
    const parsed = UpdateEnrollmentSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 });
    }

    const enrollment = await enrollmentRepository.update(Number(id), {
        mentorId: parsed.data.mentorId,
    });
    return Response.json(enrollment);
}
