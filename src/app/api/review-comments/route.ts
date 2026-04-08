import { NextRequest } from 'next/server'

import { reviewCommentRepository } from '@backend/review-comments/repository'
import { CreateReviewCommentSchema } from '@backend/review-comments/schema'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const threadId = searchParams.get('threadId')

    const comments = await reviewCommentRepository.findAll(
        threadId ? { threadId: Number(threadId) } : undefined,
    )

    return Response.json(comments)
}

export async function POST(request: NextRequest) {
    const body: unknown = await request.json()
    const parsed = CreateReviewCommentSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const comment = await reviewCommentRepository.create(parsed.data)
    return Response.json(comment, { status: 201 })
}
