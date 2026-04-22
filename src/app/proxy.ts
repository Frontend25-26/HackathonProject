/**
 * src/proxy.ts — Edge Proxy для обработки mock запросов в режиме USE_MOCKS=true
 *
 * Переписывает все /api/* запросы на /api/dev/use-mocks с параметрами:
 *  - route: путь оригинального запроса (через x-mock-route header)
 *  - method: HTTP метод (через x-mock-method header)
 *
 * В режиме USE_MOCKS=false пропускает все запросы дальше к route handlers.
 *
 * Note: Это было middleware.ts в старых версиях Next.js, переименовано в proxy.ts
 * для следования новой convention в Next.js 16+
 */

import { NextRequest, NextResponse } from 'next/server'
import { Session } from 'next-auth'

import { Roles } from '@/app/shared/types/roles'
import { auth } from '@/features/auth/authSetup'
import { userRepository } from '@backend/users/repository'

export const config = {
    matcher: [
        '/admin/:path*',
        '/mentor/:path*',
        '/student/:path*',
        /*
         * Применяем middleware ко всем API маршрутам
         */
        //'/api/:path*'
    ],
}

const rolesRights = {
    [Roles.Admin]: ['admin'],
    [Roles.Mentor]: ['mentor'],
    [Roles.Student]: ['student'],
    [Roles.Unauthorised]: [],
}

const rolesMatcher = {
    ADMIN: Roles.Admin,
    MENTOR: Roles.Mentor,
    STUDENT: Roles.Student,
}

export async function proxy(request: NextRequest) {
    // В режиме USE_MOCKS переписываем все API запросы на dev handler
    // if (process.env.USE_MOCKS === 'true' && pathname.startsWith('/api/')) {
    //     // Пропускаем реальные handler'ы (не мокируем)
    //     if (
    //         pathname.startsWith('/api/dev/') ||
    //         pathname.startsWith('/api/docs') ||
    //         pathname.startsWith('/api/auth/')
    //     ) {
    //         const r = NextResponse.next()
    //         return r
    //     }

    //     console.log(request)

    //     const route = pathname.slice('/api'.length)
    //     const newUrl = request.nextUrl.clone()
    //     newUrl.pathname = '/api/dev/use-mocks'

    //     // Передаем route через custom header (query параметры не работают с rewrite)
    //     const headers = new Headers(request.headers)
    //     headers.set('x-mock-route', route)
    //     headers.set('x-mock-method', request.method)

    //     // Логируем перехват с ролью пользователя (если передана)
    //     const role = headers.get('x-mock-user-id') || 'без авторизации'
    //     console.log(`🟢 MOCK: ${request.method} ${route} (${role})`)

    //     const newRequest = new NextRequest(newUrl, {
    //         method: request.method,
    //         headers,
    //         body: request.body,
    //     })

    //     return NextResponse.rewrite(newUrl, { request: newRequest })
    // }
    const url = request.nextUrl.pathname

    const session = (await auth()) as Session

    let meData = null
    if (session?.user?.userId) {
        meData = await userRepository.findById(session.user.userId)
    }

    let role = Roles.Unauthorised
    if (meData && meData.role) {
        role = rolesMatcher[meData.role] || Roles.Unauthorised
    }

    const requiredRole = url.split('/').at(1)

    for (const possibleRole in rolesRights[role]) {
        if (requiredRole === rolesRights[role][possibleRole]) {
            return NextResponse.next()
        }
    }
    const errorMessage = 'Reading ' + url + ' cannot be done with role ' + role
    return Response.json(
        { success: false, message: errorMessage },
        { status: 403 },
    )
}
