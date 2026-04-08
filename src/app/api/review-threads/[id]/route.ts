import { NextRequest } from 'next/server'

import { reviewThreadRepository } from '@backend/review-threads/repository'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = await params
    const thread = await reviewThreadRepository.findById(Number(id))

    if (!thread) {
        return Response.json({ error: 'Thread not found' }, { status: 404 })
    }

    return Response.json(thread)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
    const { id } = await params

    const existing = await reviewThreadRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Thread not found' }, { status: 404 })
    }

    await reviewThreadRepository.delete(Number(id))
    return new Response(null, { status: 204 })
}
