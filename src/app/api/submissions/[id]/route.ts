import { NextRequest } from 'next/server'

import { submissionRepository } from '@backend/submissions/repository'
import { UpdateSubmissionSchema } from '@backend/submissions/schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = await params
    const submission = await submissionRepository.findById(Number(id))

    if (!submission) {
        return Response.json({ error: 'Submission not found' }, { status: 404 })
    }

    return Response.json(submission)
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const { id } = await params
    const body: unknown = await request.json()
    const parsed = UpdateSubmissionSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await submissionRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Submission not found' }, { status: 404 })
    }

    const submission = await submissionRepository.update(
        Number(id),
        parsed.data,
    )
    return Response.json(submission)
}
