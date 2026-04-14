/**
 * GET   /api/submissions/[id] — получить сабмишн по ID
 * PATCH /api/submissions/[id] — обновить сабмишн
 *
 * Группа: (protected) — требует любой аутентифицированный пользователь.
 *
 * Логика доступа:
 *  GET   — STUDENT видит только свои сабмишны; MENTOR/ADMIN видят любые.
 *  PATCH — STUDENT обновляет только свои сабмишны; MENTOR/ADMIN — любые.
 */

import { NextRequest } from 'next/server'

import { requireAuth } from '@backend/lib/auth'
import { Role } from '@backend/generated/prisma'
import { submissionRepository } from '@backend/submissions/repository'
import { UpdateSubmissionSchema } from '@backend/submissions/schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { id } = await params
    const submission = await submissionRepository.findById(Number(id))

    if (!submission) {
        return Response.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Студент может видеть только свои сабмишны
    if (
        auth.user.role === Role.STUDENT &&
        submission.studentId !== auth.user.id
    ) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json(submission)
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { id } = await params
    const body: unknown = await request.json()
    const parsed = UpdateSubmissionSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await submissionRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Студент может обновлять только свои сабмишны
    if (
        auth.user.role === Role.STUDENT &&
        existing.studentId !== auth.user.id
    ) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const submission = await submissionRepository.update(Number(id), parsed.data)
    return Response.json(submission)
}
