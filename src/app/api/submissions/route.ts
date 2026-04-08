import { NextRequest } from 'next/server'

import { submissionRepository } from '@backend/submissions/repository'
import { CreateSubmissionSchema } from '@backend/submissions/schema'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const assignmentId = searchParams.get('assignmentId')
    const studentId = searchParams.get('studentId')

    const submissions = await submissionRepository.findAll({
        ...(assignmentId && { assignmentId: Number(assignmentId) }),
        ...(studentId && { studentId: Number(studentId) }),
    })

    return Response.json(submissions)
}

export async function POST(request: NextRequest) {
    const body: unknown = await request.json()
    const parsed = CreateSubmissionSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await submissionRepository.findByAssignmentAndStudent(
        parsed.data.assignmentId,
        parsed.data.studentId,
    )
    if (existing) {
        return Response.json(
            { error: 'Submission already exists for this student and assignment' },
            { status: 409 },
        )
    }

    const submission = await submissionRepository.create(parsed.data)
    return Response.json(submission, { status: 201 })
}
