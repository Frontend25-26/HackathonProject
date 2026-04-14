/**
 * GET  /api/review-threads — список тредов (фильтр по reviewId)
 * POST /api/review-threads — создать тред
 *
 * Группа: (mentor) — требует роль MENTOR или ADMIN.
 */

import { NextRequest } from 'next/server'

import { requireMentor } from '@backend/lib/auth'
import { reviewThreadRepository } from '@backend/review-threads/repository'
import { CreateReviewThreadSchema } from '@backend/review-threads/schema'

export async function GET(request: NextRequest) {
    const auth = await requireMentor(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const reviewId = searchParams.get('reviewId')

    const threads = await reviewThreadRepository.findAll(
        reviewId ? { reviewId: Number(reviewId) } : undefined,
    )

    return Response.json(threads)
}

export async function POST(request: NextRequest) {
    const auth = await requireMentor(request)
    if (!auth.ok) return auth.response

    const body: unknown = await request.json()
    const parsed = CreateReviewThreadSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const thread = await reviewThreadRepository.create(parsed.data)
    return Response.json(thread, { status: 201 })
}
