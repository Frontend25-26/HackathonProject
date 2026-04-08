import { NextRequest } from 'next/server'

import { enrollmentRepository } from '@backend/enrollments/repository'
import { CreateEnrollmentSchema } from '@backend/enrollments/schema'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const courseId = searchParams.get('courseId')
    const studentId = searchParams.get('studentId')

    const enrollments = await enrollmentRepository.findAll({
        ...(courseId && { courseId: Number(courseId) }),
        ...(studentId && { studentId: Number(studentId) }),
    })

    return Response.json(enrollments)
}

export async function POST(request: NextRequest) {
    const body: unknown = await request.json()
    const parsed = CreateEnrollmentSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await enrollmentRepository.findByCourseAndStudent(
        parsed.data.courseId,
        parsed.data.studentId,
    )
    if (existing) {
        return Response.json(
            { error: 'Student is already enrolled in this course' },
            { status: 409 },
        )
    }

    const enrollment = await enrollmentRepository.create(parsed.data)
    return Response.json(enrollment, { status: 201 })
}
