/**
 * GET  /api/review-comments — список комментариев (фильтр по threadId)
 * POST /api/review-comments — добавить комментарий
 *
 * - MENTOR может читать/писать везде
 * - STUDENT может читать везде, писать только в треды своего review
 */

import { NextRequest } from 'next/server'

import { requireAuth } from '@backend/lib/auth'
import { prisma } from '@backend/lib/prisma'
import { reviewCommentRepository } from '@backend/review-comments/repository'
import { CreateReviewCommentSchema } from '@backend/review-comments/schema'

export async function GET(request: NextRequest) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const threadId = searchParams.get('threadId')

    const comments = await reviewCommentRepository.findAll(
        threadId ? { threadId: Number(threadId) } : undefined,
    )

    return Response.json(comments)
}

export async function POST(request: NextRequest) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const body: unknown = await request.json()
    const parsed = CreateReviewCommentSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    // Получаем тред с его review
    const thread = await prisma.reviewThread.findUnique({
        where: { id: parsed.data.threadId },
        select: {
            review: {
                select: {
                    submission: {
                        select: { studentId: true },
                    },
                },
            },
        },
    })

    if (!thread) {
        return Response.json({ error: 'Тред не найден' }, { status: 404 })
    }

    // MENTOR/ADMIN может писать везде
    if (auth.user.role === 'MENTOR' || auth.user.role === 'ADMIN') {
        const comment = await reviewCommentRepository.create({
            ...parsed.data,
            authorId: auth.user.id,
        })
        return Response.json(comment, { status: 201 })
    }

    // STUDENT может писать только в собственный review
    if (auth.user.role === 'STUDENT') {
        if (thread.review.submission.studentId !== auth.user.id) {
            return Response.json(
                { error: 'Вы не можете писать комментарии в чужом review' },
                { status: 403 },
            )
        }

        const comment = await reviewCommentRepository.create({
            ...parsed.data,
            authorId: auth.user.id,
        })
        return Response.json(comment, { status: 201 })
    }

    return Response.json({ error: 'Доступ запрещен' }, { status: 403 })
}
