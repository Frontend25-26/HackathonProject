import { NextRequest } from 'next/server'

import { reviewRepository } from '@backend/reviews/repository'
import { CreateReviewSchema } from '@backend/reviews/schema'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const submissionId = searchParams.get('submissionId')

    const reviews = await reviewRepository.findAll(
        submissionId ? { submissionId: Number(submissionId) } : undefined,
    )

    return Response.json(reviews)
}

export async function POST(request: NextRequest) {
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

    const review = await reviewRepository.create(parsed.data)
    return Response.json(review, { status: 201 })
}
