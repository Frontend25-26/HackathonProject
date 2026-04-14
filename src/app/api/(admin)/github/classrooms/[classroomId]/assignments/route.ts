/**
 * GET /api/github/classrooms/[classroomId]/assignments — список заданий классрума
 *
 * Группа: (admin) — требует роль ADMIN.
 */

import { NextRequest } from 'next/server'

import { requireAdmin } from '@backend/lib/auth'
import { classroomApi } from '@backend/github/classroom'

type Params = { params: Promise<{ classroomId: string }> }

export async function GET(request: NextRequest, { params }: Params) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { classroomId } = await params

    try {
        const assignments = await classroomApi.listAssignments(
            Number(classroomId),
        )
        return Response.json(assignments)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'GitHub API error'
        return Response.json({ error: message }, { status: 502 })
    }
}
