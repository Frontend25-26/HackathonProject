/**
 * GET   /api/users/[id] — получить пользователя по ID
 * PATCH /api/users/[id] — обновить данные пользователя
 *
 * GET требует роль ADMIN.
 *
 * PATCH — студент может обновить только свой профиль (name, email, avatar).
 *  Изменение роли (role) и редактирование чужого профиля доступно только ADMIN.
 *  Для просмотра собственного профиля используйте GET /api/me.
 */

import { NextRequest } from 'next/server'

import { Role } from '@backend/generated/prisma'
import { requireAdmin, requireAuth } from '@backend/lib/auth'
import { userRepository } from '@backend/users/repository'
import { UpdateUserSchema } from '@backend/users/schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { id } = await params
    const user = await userRepository.findById(Number(id))

    if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json(user)
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { id } = await params
    const targetId = Number(id)
    const isAdmin = auth.user.role === Role.ADMIN
    const isSelf = auth.user.id === targetId

    // Не-ADMIN не может редактировать чужой профиль
    if (!isAdmin && !isSelf) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: unknown = await request.json()
    const parsed = UpdateUserSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    // Не-ADMIN не может менять роль
    if (!isAdmin && parsed.data.role !== undefined) {
        return Response.json(
            { error: 'Only ADMIN can change user role' },
            { status: 403 },
        )
    }

    const existing = await userRepository.findById(targetId)
    if (!existing) {
        return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const user = await userRepository.update(targetId, parsed.data)
    return Response.json(user)
}
