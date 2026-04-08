import { userRepository } from '@backend/users/repository'

/**
 * GET /api/me — текущий пользователь и его роль
 *
 * В dev-режиме (USE_MOCKS=true): возвращает первого пользователя из БД.
 *
 * TODO: После подключения Auth.js заменить на:
 * ```ts
 * const session = await auth()
 * if (!session?.user?.githubId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
 * const user = await userRepository.findByGithubId(Number(session.user.githubId))
 * ```
 * См. docs/backend.md → "Интеграция Auth.js"
 */
export async function GET() {
    if (process.env.USE_MOCKS === 'true') {
        const users = await userRepository.findAll()
        const first = users[0]

        if (!first) {
            return Response.json({ error: 'No users in DB' }, { status: 404 })
        }

        return Response.json(first)
    }

    return Response.json(
        {
            error: 'Unauthorized. Auth.js not configured yet.',
            hint: 'Set USE_MOCKS=true for development or configure Auth.js for production.',
        },
        { status: 401 },
    )
}
