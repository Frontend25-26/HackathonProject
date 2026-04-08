import { classroomApi } from '@backend/github/classroom'

export async function GET() {
    try {
        const classrooms = await classroomApi.listClassrooms()
        return Response.json(classrooms)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'GitHub API error'
        return Response.json({ error: message }, { status: 502 })
    }
}
