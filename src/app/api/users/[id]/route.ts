import { NextRequest } from 'next/server'

import { userRepository } from '@backend/users/repository'
import { UpdateUserSchema } from '@backend/users/schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = await params
    const user = await userRepository.findById(Number(id))

    if (!user) {
        return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json(user)
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const { id } = await params
    const body: unknown = await request.json()
    const parsed = UpdateUserSchema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const existing = await userRepository.findById(Number(id))
    if (!existing) {
        return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const user = await userRepository.update(Number(id), parsed.data)
    return Response.json(user)
}
