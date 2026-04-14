/**
 * GET  /api/review-threads — список тредов
 * POST /api/review-threads — создать тред
 *
 * - MENTOR видит все треды, может создавать везде
 * - STUDENT видит только свои треды, может создавать только в своих review
 */

import { NextRequest } from 'next/server'

import { requireAuth } from '@backend/lib/auth'
import { prisma } from '@backend/lib/prisma'
import { reviewThreadRepository } from '@backend/review-threads/repository'
import { CreateReviewThreadSchema } from '@backend/review-threads/schema'

export async function GET(request: NextRequest) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const reviewId = searchParams.get('reviewId')

    // MENTOR/ADMIN видит все
    if (auth.user.role === 'MENTOR' || auth.user.role === 'ADMIN') {
        const threads = await reviewThreadRepository.findAll(
            reviewId ? { reviewId: Number(reviewId) } : undefined,
        )
        return Response.json(threads)
    }

    // STUDENT видит только для своих review
    if (auth.user.role === 'STUDENT') {
        const review = await prisma.review.findFirst({
            where: {
                submission: {
                    studentId: auth.user.id,
                },
            },
            select: { id: true },
        })

        if (!review) {
            return Response.json([], { status: 200 })
        }

        const threads = await reviewThreadRepository.findAll({
            reviewId: review.id,
        })
        return Response.json(threads)
    }

    return Response.json({ error: 'Доступ запрещен' }, { status: 403 })
}

export async function POST(request: NextRequest) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const body: unknown = await request.json()

    const parsed = CreateReviewThreadSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    // Получаем review с его submission
    const review = await prisma.review.findUnique({
        where: { id: parsed.data.reviewId },
        select: {
            submission: {
                select: { studentId: true },
            },
        },
    })

    if (!review) {
        return Response.json({ error: 'Review не найден' }, { status: 404 })
    }

    // MENTOR/ADMIN может создавать везде
    if (auth.user.role === 'MENTOR' || auth.user.role === 'ADMIN') {
        const thread = await reviewThreadRepository.create(parsed.data)
        return Response.json(thread, { status: 201 })
    }

    // STUDENT может создавать только в своем review
    if (auth.user.role === 'STUDENT') {
        if (review.submission.studentId !== auth.user.id) {
            return Response.json(
                {
                    error: 'Вы не можете создавать треды в чужом review',
                },
                { status: 403 },
            )
        }

        const thread = await reviewThreadRepository.create(parsed.data)
        return Response.json(thread, { status: 201 })
    }

    return Response.json({ error: 'Доступ запрещен' }, { status: 403 })
}
