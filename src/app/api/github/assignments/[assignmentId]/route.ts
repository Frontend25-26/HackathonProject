import { NextRequest } from 'next/server'

import { classroomApi } from '@backend/github/classroom'

type Params = { params: Promise<{ assignmentId: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
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
