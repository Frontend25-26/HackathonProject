/**
 * GET  /api/courses — список курсов
 * POST /api/courses — создать курс
 *
 * Группа: (protected) — GET доступен любому аутентифицированному пользователю.
 * POST требует роль ADMIN.
 */

import { NextRequest } from 'next/server'

import { courseRepository } from '@backend/courses/repository'
import { CreateCourseSchema } from '@backend/courses/schema'
import { requireAuth, requireAdmin } from '@backend/lib/auth'

export async function GET(request: NextRequest) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const courses = await courseRepository.findAll()
    return Response.json(courses)
}

export async function POST(request: NextRequest) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const body: unknown = await request.json()
    const parsed = CreateCourseSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const course = await courseRepository.create(parsed.data)
    return Response.json(course, { status: 201 })
}
