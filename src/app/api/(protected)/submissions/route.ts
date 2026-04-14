/**
 * GET  /api/submissions — список сабмишнов
 * POST /api/submissions — создать сабмишн
 *
 * Группа: (protected) — требует любой аутентифицированный пользователь.
 *
 * Логика доступа:
 *  GET  — STUDENT видит только свои сабмишны; MENTOR/ADMIN видит все.
 *  POST — студент создаёт сабмишн от своего имени (studentId берётся
 *         из токена, не из тела запроса).
 */

import { NextRequest } from 'next/server'

import { Role } from '@backend/generated/prisma'
import { requireAuth } from '@backend/lib/auth'
import { submissionRepository } from '@backend/submissions/repository'
import { CreateSubmissionSchema } from '@backend/submissions/schema'

export async function GET(request: NextRequest) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const assignmentId = searchParams.get('assignmentId')

    // STUDENT видит только свои сабмишны
    const studentIdParam =
        auth.user.role === Role.STUDENT
            ? auth.user.id
            : searchParams.get('studentId')
              ? Number(searchParams.get('studentId'))
              : undefined

    const submissions = await submissionRepository.findAll({
        ...(assignmentId && { assignmentId: Number(assignmentId) }),
        ...(studentIdParam !== undefined && { studentId: studentIdParam }),
    })

    return Response.json(submissions)
}

export async function POST(request: NextRequest) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const body: unknown = await request.json()
    const parsed = CreateSubmissionSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    // Студент может создавать сабмишн только от своего имени
    if (
        auth.user.role === Role.STUDENT &&
        parsed.data.studentId !== auth.user.id
    ) {
        return Response.json(
            { error: 'Cannot create submission for another student' },
            { status: 403 },
        )
    }

    const existing = await submissionRepository.findByAssignmentAndStudent(
        parsed.data.assignmentId,
        parsed.data.studentId,
    )
    if (existing) {
        return Response.json(
            {
                error: 'Submission already exists for this student and assignment',
            },
            { status: 409 },
        )
    }

    const submission = await submissionRepository.create(parsed.data)
    return Response.json(submission, { status: 201 })
}
