/**
 * GET /api/github/assignments/[assignmentId] — получить задание GitHub Classroom
 *
 * Группа: (admin) — требует роль ADMIN.
 */

import { NextRequest } from 'next/server'

import { requireAdmin } from '@backend/lib/auth'
import { classroomApi } from '@backend/github/classroom'

type Params = { params: Promise<{ assignmentId: string }> }

export async function GET(request: NextRequest, { params }: Params) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { assignmentId } = await params

    try {
        const assignment = await classroomApi.getAssignment(
            Number(assignmentId),
        )
        return Response.json(assignment)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'GitHub API error'
        return Response.json({ error: message }, { status: 502 })
    }
}
