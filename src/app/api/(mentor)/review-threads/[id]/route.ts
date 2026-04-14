/**
 * GET    /api/review-threads/[id] — получить тред по ID
 * DELETE /api/review-threads/[id] — удалить тред
 *
 * Группа: (mentor) — требует роль MENTOR или ADMIN.
 */

import { NextRequest } from 'next/server'

import { requireMentor } from '@backend/lib/auth'
import { reviewThreadRepository } from '@backend/review-threads/repository'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
    const auth = await requireMentor(request)
    if (!auth.ok) return auth.response

    const { id } = await params
    const thread = await reviewThreadRepository.findById(Number(id))

    if (!thread) {
        return Response.json({ error: 'Thread not found' }, { status: 404 })
    }

    return Response.json(thread)
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const auth = await requireMentor(request)
    if (!auth.ok) return auth.response

    const { id } = await params

    const existing = await reviewThreadRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'Thread not found' }, { status: 404 })
    }

    await reviewThreadRepository.delete(Number(id))
    return new Response(null, { status: 204 })
}
