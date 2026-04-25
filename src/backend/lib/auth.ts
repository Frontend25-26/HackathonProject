/**
 * src/backend/lib/auth.ts
 *
 * Утилиты авторизации для API route handlers.
 * Источник истины — NextAuth-сессия: auth() читает cookies через next/headers.
 */

import { auth } from '@/features/auth/authSetup';
import { Role } from '@backend/generated/prisma';

// ─── Типы ────────────────────────────────────────────────────────────────────

export type AuthUser = {
    id: number;
    role: Role;
};

export type AuthResult =
    | { ok: true; user: AuthUser }
    | { ok: false; response: Response };

// ─── Вспомогательные ─────────────────────────────────────────────────────────

export function unauthorized(message = 'Unauthorized'): Response {
    return Response.json({ error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden'): Response {
    return Response.json({ error: message }, { status: 403 });
}

// ─── Получение пользователя ───────────────────────────────────────────────────

export async function getCurrentUser(): Promise<AuthUser | null> {
    const session = await auth();
    if (!session?.user?.userId || !session.user.role) return null;
    return {
        id: session.user.userId,
        role: session.user.role,
    };
}

// ─── Гарды ───────────────────────────────────────────────────────────────────

/**
 * Требует любого аутентифицированного пользователя.
 *
 * Использование в route handler:
 * ```ts
 * const auth = await requireAuth()
 * if (!auth.ok) return auth.response
 * const { user } = auth
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
    const user = await getCurrentUser();

    if (!user) {
        return { ok: false, response: unauthorized() };
    }

    return { ok: true, user };
}

/**
 * Требует роль MENTOR или ADMIN.
 */
export async function requireMentor(): Promise<AuthResult> {
    const result = await requireAuth();

    if (!result.ok) return result;

    const { user } = result;

    if (user.role !== Role.MENTOR && user.role !== Role.ADMIN) {
        return {
            ok: false,
            response: forbidden('Mentor or Admin role required'),
        };
    }

    return { ok: true, user };
}

/**
 * Требует роль ADMIN.
 */
export async function requireAdmin(): Promise<AuthResult> {
    const result = await requireAuth();

    if (!result.ok) return result;

    const { user } = result;

    if (user.role !== Role.ADMIN) {
        return { ok: false, response: forbidden('Admin role required') };
    }

    return { ok: true, user };
}

// ─── Хелперы для ownership ────────────────────────────────────────────────────

/**
 * Проверяет, что пользователь является владельцем ресурса
 * (или имеет роль MENTOR/ADMIN, которая даёт обход ограничения).
 */
export function isOwnerOrMentor(user: AuthUser, ownerId: number): boolean {
    if (user.role === Role.MENTOR || user.role === Role.ADMIN) return true;
    return user.id === ownerId;
}
