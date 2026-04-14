/**
 * GET    /api/courses/[id] — получить курс по ID
 * PATCH  /api/courses/[id] — обновить курс
 * DELETE /api/courses/[id] — удалить курс
 *
 * GET доступен любому аутентифицированному пользователю.
 * PATCH и DELETE требуют роль ADMIN.
 */

import { NextRequest } from 'next/server'

import { courseRepository } from '@backend/courses/repository'
import { UpdateCourseSchema } from '@backend/courses/schema'
import { requireAuth, requireAdmin } from '@backend/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { id } = await params
    const course = await courseRepository.findById(Number(id))

    if (!course) {
        return Response.json({ error: 'Course not found' }, { status: 404 })
    }

    return Response.json(course)
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { id } = await params
    const body: unknown = await request.json()
    const parsed = UpdateCourseSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await courseRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Course not found' }, { status: 404 })
    }

    const course = await courseRepository.update(Number(id), parsed.data)
    return Response.json(course)
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { id } = await params

    const existing = await courseRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Course not found' }, { status: 404 })
    }

    await courseRepository.delete(Number(id))
    return new Response(null, { status: 204 })
}
