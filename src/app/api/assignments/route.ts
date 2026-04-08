import { NextRequest } from 'next/server'

import { assignmentRepository } from '@backend/assignments/repository'
import { CreateAssignmentSchema } from '@backend/assignments/schema'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const courseId = searchParams.get('courseId')

    const assignments = await assignmentRepository.findAll(
        courseId ? { courseId: Number(courseId) } : undefined,
    )

    return Response.json(assignments)
}

export async function POST(request: NextRequest) {
    const body: unknown = await request.json()
    const parsed = CreateAssignmentSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const assignment = await assignmentRepository.create({
        ...parsed.data,
        dueDate: new Date(parsed.data.dueDate),
    })

    return Response.json(assignment, { status: 201 })
}
