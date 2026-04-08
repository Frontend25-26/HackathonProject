import { NextRequest } from 'next/server'

import { reviewCommentRepository } from '@backend/review-comments/repository'
import { UpdateReviewCommentSchema } from '@backend/review-comments/schema'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
    const { id } = await params
    const body: unknown = await request.json()
    const parsed = UpdateReviewCommentSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await reviewCommentRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Comment not found' }, { status: 404 })
    }

    const comment = await reviewCommentRepository.update(
        Number(id),
        parsed.data,
    )
    return Response.json(comment)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
    const { id } = await params

    const existing = await reviewCommentRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Comment not found' }, { status: 404 })
    }

    await reviewCommentRepository.delete(Number(id))
    return new Response(null, { status: 204 })
}
