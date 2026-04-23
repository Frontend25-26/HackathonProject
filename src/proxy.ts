import { NextRequest, NextResponse } from 'next/server';
import { auth } from './features/auth/authSetup';

export const config = {
    matcher: [
        '/admin/:path*',
        '/mentor/:path*',
        '/student/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

const rolesRights: Record<string, string[]> = {
    ADMIN: ['admin', 'mentor', 'student'],
    MENTOR: ['mentor', 'student'],
    STUDENT: ['student'],
};

function getRedirect(request: NextRequest, path: string) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = path;
    return NextResponse.redirect(redirectUrl);
}

export default auth((req) => {
    const session = req.auth;
    const pathname = req.nextUrl.pathname;
    const isLoginPage = pathname === '/login';

    if (!session) {
        if (!isLoginPage) {
            return getRedirect(req, '/login');
        }
        return NextResponse.next();
    }

    if (isLoginPage) {
        return getRedirect(req, '/');
    }

    const requestedSegment = pathname.split('/').at(1) ?? '';
    const allowedSegments = rolesRights[session.user.role] ?? [];

    if (
        requestedSegment &&
        ['admin', 'mentor', 'student'].includes(requestedSegment) &&
        !allowedSegments.includes(requestedSegment)
    ) {
        return getRedirect(req, '/forbidden');
    }

    return NextResponse.next();
});
