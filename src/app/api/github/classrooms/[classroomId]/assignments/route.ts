import { NextRequest } from 'next/server'

import { classroomApi } from '@backend/github/classroom'

type Params = { params: Promise<{ classroomId: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
    const { classroomId } = await params

    try {
        const assignments = await classroomApi.listAssignments(Number(classroomId))
        return Response.json(assignments)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'GitHub API error'
        return Response.json({ error: message }, { status: 502 })
    }
}
