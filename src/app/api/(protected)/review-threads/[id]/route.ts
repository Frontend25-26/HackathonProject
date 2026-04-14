/**
 * GET    /api/review-threads/[id] — получить тред по ID
 * DELETE /api/review-threads/[id] — удалить тред (только MENTOR)
 */

import { NextRequest } from 'next/server'

import { requireAuth } from '@backend/lib/auth'
import { prisma } from '@backend/lib/prisma'
import { reviewThreadRepository } from '@backend/review-threads/repository'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { id } = await params
    const thread = await reviewThreadRepository.findById(Number(id))

    if (!thread) {
        return Response.json({ error: 'Тред не найден' }, { status: 404 })
    }

    // MENTOR/ADMIN видит все
    if (auth.user.role === 'MENTOR' || auth.user.role === 'ADMIN') {
        return Response.json(thread)
    }

    // STUDENT видит только свой тред
    if (auth.user.role === 'STUDENT') {
        const review = await prisma.review.findUnique({
            where: { id: thread.reviewId },
            select: {
                submission: {
                    select: { studentId: true },
                },
            },
        })

        if (!review || review.submission.studentId !== auth.user.id) {
            return Response.json({ error: 'Доступ запрещен' }, { status: 403 })
        }

        return Response.json(thread)
    }

    return Response.json({ error: 'Доступ запрещен' }, { status: 403 })
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    // Только MENTOR/ADMIN может удалять треды
    if (auth.user.role !== 'MENTOR' && auth.user.role !== 'ADMIN') {
        return Response.json(
            { error: 'Только MENTOR может удалять треды' },
            { status: 403 },
        )
    }

    const { id } = await params
    const thread = await reviewThreadRepository.findById(Number(id))

    if (!thread) {
        return Response.json({ error: 'Тред не найден' }, { status: 404 })
    }

    await reviewThreadRepository.delete(Number(id))
    return Response.json(null, { status: 204 })
}
