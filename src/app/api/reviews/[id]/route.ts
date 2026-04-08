import { NextRequest } from 'next/server'

import { reviewRepository } from '@backend/reviews/repository'
import { UpdateReviewSchema } from '@backend/reviews/schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = await params
    const review = await reviewRepository.findById(Number(id))

    if (!review) {
        return Response.json({ error: 'Review not found' }, { status: 404 })
    }

    return Response.json(review)
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const { id } = await params
    const body: unknown = await request.json()
    const parsed = UpdateReviewSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await reviewRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Review not found' }, { status: 404 })
    }

    const review = await reviewRepository.update(Number(id), parsed.data)
    return Response.json(review)
}
