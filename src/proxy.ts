// eslint-disable-next-line boundaries/no-unknown-files
import { NextResponse } from 'next/server'

import { auth } from '@/features/auth/authSetup'

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const pathname = req.nextUrl.pathname
    const isLoginPage = pathname === '/login'

    if (!isLoggedIn && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
