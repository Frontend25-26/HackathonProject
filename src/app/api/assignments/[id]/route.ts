import { NextRequest } from 'next/server'

import { assignmentRepository } from '@backend/assignments/repository'
import { UpdateAssignmentSchema } from '@backend/assignments/schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = await params
    const assignment = await assignmentRepository.findById(Number(id))

    if (!assignment) {
        return Response.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return Response.json(assignment)
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const { id } = await params
    const body: unknown = await request.json()
    const parsed = UpdateAssignmentSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await assignmentRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Assignment not found' }, { status: 404 })
    }

    const { dueDate, ...rest } = parsed.data
    const assignment = await assignmentRepository.update(Number(id), {
        ...rest,
        ...(dueDate && { dueDate: new Date(dueDate) }),
    })

    return Response.json(assignment)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
    const { id } = await params

    const existing = await assignmentRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Assignment not found' }, { status: 404 })
    }

    await assignmentRepository.delete(Number(id))
    return new Response(null, { status: 204 })
}
