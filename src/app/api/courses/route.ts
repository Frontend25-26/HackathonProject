import { NextRequest } from 'next/server'

import { courseRepository } from '@backend/courses/repository'
import { CreateCourseSchema } from '@backend/courses/schema'

export async function GET() {
    const courses = await courseRepository.findAll()
    return Response.json(courses)
}

export async function POST(request: NextRequest) {
    const body: unknown = await request.json()
    const parsed = CreateCourseSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const course = await courseRepository.create(parsed.data)
    return Response.json(course, { status: 201 })
}
