/**
 * GET    /api/assignments/[id] — получить задание по ID
 * PATCH  /api/assignments/[id] — обновить задание
 * DELETE /api/assignments/[id] — удалить задание
 *
 * GET доступен любому аутентифицированному пользователю.
 * PATCH и DELETE требуют роль ADMIN.
 */

import { NextRequest } from 'next/server'

import { assignmentRepository } from '@backend/assignments/repository'
import { UpdateAssignmentSchema } from '@backend/assignments/schema'
import { requireAuth, requireAdmin } from '@backend/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { id } = await params
    const assignment = await assignmentRepository.findById(Number(id))

    if (!assignment) {
        return Response.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return Response.json(assignment)
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

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

export async function DELETE(request: NextRequest, { params }: Params) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { id } = await params

    const existing = await assignmentRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Assignment not found' }, { status: 404 })
    }

    await assignmentRepository.delete(Number(id))
    return new Response(null, { status: 204 })
}
