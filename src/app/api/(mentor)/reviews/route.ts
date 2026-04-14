/**
 * GET  /api/reviews — список ревью
 * POST /api/reviews — создать ревью
 *
 * Группа: (mentor) — требует роль MENTOR или ADMIN.
 *
 * Только менторы и администраторы могут создавать и просматривать ревью.
 * Автором ревью автоматически становится текущий аутентифицированный
 * пользователь (reviewerId из токена).
 */

import { NextRequest } from 'next/server'

import { requireMentor } from '@backend/lib/auth'
import { reviewRepository } from '@backend/reviews/repository'
import { CreateReviewSchema } from '@backend/reviews/schema'

export async function GET(request: NextRequest) {
    const auth = await requireMentor(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const submissionId = searchParams.get('submissionId')

    const reviews = await reviewRepository.findAll(
        submissionId ? { submissionId: Number(submissionId) } : undefined,
    )

    return Response.json(reviews)
}

export async function POST(request: NextRequest) {
    const auth = await requireMentor(request)
    if (!auth.ok) return auth.response

    const body: unknown = await request.json()
    const parsed = CreateReviewSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await reviewRepository.findBySubmissionId(
        parsed.data.submissionId,
    )
    if (existing) {
        return Response.json(
            { error: 'Review for this submission already exists' },
            { status: 409 },
        )
    }

    // mentorId берётся из аутентифицированного пользователя
    const review = await reviewRepository.create({
        ...parsed.data,
        mentorId: auth.user.id,
    })
    return Response.json(review, { status: 201 })
}
