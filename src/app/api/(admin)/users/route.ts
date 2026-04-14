/**
 * GET  /api/users — список пользователей
 * POST /api/users — создать пользователя
 *
 * Группа: (admin) — требует роль ADMIN.
 *
 * Только администраторы могут управлять пользователями системы.
 */

import { NextRequest } from 'next/server'

import { requireAdmin } from '@backend/lib/auth'
import { userRepository } from '@backend/users/repository'
import { CreateUserSchema } from '@backend/users/schema'

export async function GET(request: NextRequest) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const users = await userRepository.findAll()
    return Response.json(users)
}

export async function POST(request: NextRequest) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const body: unknown = await request.json()
    const parsed = CreateUserSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await userRepository.findByGithubId(parsed.data.githubId)
    if (existing) {
        return Response.json(
            { error: 'User with this githubId already exists' },
            { status: 409 },
        )
    }

    const user = await userRepository.create(parsed.data)
    return Response.json(user, { status: 201 })
}
