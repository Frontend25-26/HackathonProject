/**
 * GET  /api/review-comments — список комментариев (фильтр по threadId)
 * POST /api/review-comments — добавить комментарий
 *
 * Группа: (mentor) — требует роль MENTOR или ADMIN.
 *
 * При POST authorId берётся из аутентифицированного пользователя,
 * а не из тела запроса.
 */

import { NextRequest } from 'next/server'

import { requireMentor } from '@backend/lib/auth'
import { reviewCommentRepository } from '@backend/review-comments/repository'
import { CreateReviewCommentSchema } from '@backend/review-comments/schema'

export async function GET(request: NextRequest) {
    const auth = await requireMentor(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const threadId = searchParams.get('threadId')

    const comments = await reviewCommentRepository.findAll(
        threadId ? { threadId: Number(threadId) } : undefined,
    )

    return Response.json(comments)
}

export async function POST(request: NextRequest) {
    const auth = await requireMentor(request)
    if (!auth.ok) return auth.response

    const body: unknown = await request.json()

    // authorId принимаем из тела, но перезаписываем текущим пользователем
    const parsed = CreateReviewCommentSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    // authorId берётся из токена, не из тела запроса
    const comment = await reviewCommentRepository.create({
        ...parsed.data,
        authorId: auth.user.id,
    })

    return Response.json(comment, { status: 201 })
}
