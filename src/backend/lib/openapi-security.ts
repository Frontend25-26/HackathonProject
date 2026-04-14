/**
 * src/backend/lib/openapi-security.ts
 *
 * Helpers для добавления информации о безопасности и требуемых ролях
 * к OpenAPI endpoints.
 */

export type AccessLevel = 'PUBLIC' | 'STUDENT' | 'MENTOR' | 'ADMIN'

export const ACCESS_DESCRIPTIONS: Record<AccessLevel, string> = {
    PUBLIC: 'Доступно всем без авторизации',
    STUDENT: 'Требует авторизация (любая роль)',
    MENTOR: 'Требует роль MENTOR или ADMIN',
    ADMIN: 'Требует роль ADMIN',
}

/**
 * Создаёт описание доступа для OpenAPI документации
 */
export function getAccessDescription(access: AccessLevel): string {
    return ACCESS_DESCRIPTIONS[access]
}

/**
 * Создаёт security requirement для OpenAPI
 */
export function getSecurityRequirement(access: AccessLevel) {
    if (access === 'PUBLIC') {
        return {} // Нет требований
    }

    // Для всех остальных используем bearer token
    return { bearerAuth: [] }
}

/**
 * Helper для добавления тега доступа в description
 */
export function addAccessTag(description: string, access: AccessLevel): string {
    const tag =
        access === 'PUBLIC'
            ? 'PUBLIC'
            : access === 'STUDENT'
              ? 'STUDENT'
              : access === 'MENTOR'
                ? 'MENTOR'
                : 'ADMIN'

    return `[${tag}] ${description}`
}
