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

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // В режиме USE_MOCKS переписываем все API запросы на dev handler
    if (process.env.USE_MOCKS === 'true' && pathname.startsWith('/api/')) {
        // Пропускаем реальные handler'ы (не мокируем)
        if (pathname.startsWith('/api/dev/') || pathname.startsWith('/api/docs')) {
            return NextResponse.next()
        }

        const route = pathname.slice('/api'.length)
        const newUrl = request.nextUrl.clone()
        newUrl.pathname = '/api/dev/use-mocks'

        // Передаем route через custom header (query параметры не работают с rewrite)
        const headers = new Headers(request.headers)
        headers.set('x-mock-route', route)
        headers.set('x-mock-method', request.method)

        // Логируем перехват с ролью пользователя (если передана)
        const role = headers.get('x-mock-user-id') || 'без авторизации'
        console.log(`🟢 MOCK: ${request.method} ${route} (${role})`)

        const newRequest = new NextRequest(newUrl, {
            method: request.method,
            headers,
            body: request.body,
        })

        return NextResponse.rewrite(newUrl, { request: newRequest })
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Применяем middleware ко всем API маршрутам
         */
        '/api/:path*',
    ],
}
