/**
 * src/backend/lib/auth.ts
 *
 * Утилиты авторизации для API route handlers.
 *
 * Текущая реализация поддерживает два режима:
 *  - USE_MOCKS=true: читает x-mock-user-id из заголовков (для dev/тестов)
 *  - Production: читает заголовки x-user-id / x-user-role, которые
 *    проставляет Next.js middleware после верификации сессии Auth.js.
 *
 * TODO(#19): После подключения Auth.js заменить getMockUser на:
 *   const session = await auth()
 *   if (!session?.user?.githubId) return null
 *   return userRepository.findByGithubId(Number(session.user.githubId))
 */

import { NextRequest } from 'next/server'

import { Role } from '@backend/generated/prisma'

// ─── Типы ────────────────────────────────────────────────────────────────────

export type AuthUser = {
    id: number
    role: Role
}

export type AuthResult =
    | { ok: true; user: AuthUser }
    | { ok: false; response: Response }

// ─── Вспомогательные ─────────────────────────────────────────────────────────

/**
 * Создаёт стандартный 401 ответ.
 */
export function unauthorized(message = 'Unauthorized'): Response {
    return Response.json({ error: message }, { status: 401 })
}

/**
 * Создаёт стандартный 403 ответ.
 */
export function forbidden(message = 'Forbidden'): Response {
    return Response.json({ error: message }, { status: 403 })
}

// ─── Получение пользователя ───────────────────────────────────────────────────

/**
 * В режиме USE_MOCKS=true возвращает mock пользователя по x-mock-user-id header.
 * Не обращается к БД — использует hardcoded mock данные.
 *
 * Значения x-mock-user-id:
 *  - "STUDENT" → { id: 1, role: STUDENT }
 *  - "MENTOR" → { id: 2, role: MENTOR }
 *  - "ADMIN" → { id: 3, role: ADMIN }
 *
 * ⚠️ ВАЖНО: Без заголовка x-mock-user-id возвращает null (401 Unauthorized)
 * Для тестирования ОБЯЗАТЕЛЬНО передавай заголовок!
 */
function getMockUser(request: NextRequest): AuthUser | null {
    const roleHeader = request.headers.get('x-mock-user-id')

    // Без заголовка — не авторизован
    if (!roleHeader) {
        return null
    }

    // Mock данные пользователей для тестирования
    const mockUsers: Record<string, AuthUser> = {
        STUDENT: { id: 1, role: Role.STUDENT },
        MENTOR: { id: 2, role: Role.MENTOR },
        ADMIN: { id: 3, role: Role.ADMIN },
    }

    return mockUsers[roleHeader.toUpperCase()] ?? null
}

/**
 * Считывает AuthUser из заголовков x-user-id / x-user-role,
 * которые middleware проставляет после верификации сессии.
 */
function getUserFromHeaders(request: NextRequest): AuthUser | null {
    const idHeader = request.headers.get('x-user-id')
    const roleHeader = request.headers.get('x-user-role')

    if (!idHeader || !roleHeader) return null

    const id = Number(idHeader)
    if (isNaN(id)) return null

    // Проверяем валидность роли
    const validRoles = ['STUDENT', 'MENTOR', 'ADMIN']
    if (!validRoles.includes(roleHeader)) return null

    const role = roleHeader as Role

    return { id, role }
}

/**
 * Возвращает текущего аутентифицированного пользователя или null.
 *
 * Порядок разрешения:
 *  1. USE_MOCKS=true → getMockUser()
 *  2. Иначе → заголовки x-user-id / x-user-role (проставляет middleware)
 */
export async function getCurrentUser(
    request: NextRequest,
): Promise<AuthUser | null> {
    if (process.env.USE_MOCKS === 'true') {
        return getMockUser(request)
    }

    return getUserFromHeaders(request)
}

// ─── Гарды ───────────────────────────────────────────────────────────────────

/**
 * Требует любого аутентифицированного пользователя.
 * Возвращает AuthResult: { ok: true, user } или { ok: false, response }.
 *
 * Использование в route handler:
 * ```ts
 * const auth = await requireAuth(request)
 * if (!auth.ok) return auth.response
 * const { user } = auth
 * ```
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
    const user = await getCurrentUser(request)

    if (!user) {
        return { ok: false, response: unauthorized() }
    }

    return { ok: true, user }
}

/**
 * Требует роль MENTOR или ADMIN.
 */
export async function requireMentor(request: NextRequest): Promise<AuthResult> {
    const result = await requireAuth(request)

    if (!result.ok) return result

    const { user } = result

    if (user.role !== Role.MENTOR && user.role !== Role.ADMIN) {
        return {
            ok: false,
            response: forbidden('Mentor or Admin role required'),
        }
    }

    return { ok: true, user }
}

/**
 * Требует роль ADMIN.
 */
export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
    const result = await requireAuth(request)

    if (!result.ok) return result

    const { user } = result

    if (user.role !== Role.ADMIN) {
        return { ok: false, response: forbidden('Admin role required') }
    }

    return { ok: true, user }
}

// ─── Хелперы для ownership ────────────────────────────────────────────────────

/**
 * Проверяет, что пользователь является владельцем ресурса
 * (или имеет роль MENTOR/ADMIN, которая даёт обход ограничения).
 */
export function isOwnerOrMentor(user: AuthUser, ownerId: number): boolean {
    if (user.role === Role.MENTOR || user.role === Role.ADMIN) return true
    return user.id === ownerId
}

/**
 * Добавляет данные пользователя в заголовки ответа/запроса для передачи
 * в downstream обработчики. Используется middleware групп.
 */
export function buildUserHeaders(user: AuthUser): Record<string, string> {
    return {
        'x-user-id': String(user.id),
        'x-user-role': user.role,
    }
}
