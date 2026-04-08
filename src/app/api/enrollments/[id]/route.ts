import { NextRequest } from 'next/server'

import { enrollmentRepository } from '@backend/enrollments/repository'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_request: NextRequest, { params }: Params) {
    const { id } = await params

    const existing = await enrollmentRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    await enrollmentRepository.delete(Number(id))
    return new Response(null, { status: 204 })
}
