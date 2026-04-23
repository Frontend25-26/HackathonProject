import { NextRequest, NextResponse } from 'next/server';
import { auth } from './features/auth/authSetup';

export const config = {
    matcher: ['/admin/:path*', '/mentor/:path*', '/student/:path*'],
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

export async function proxy(request: NextRequest) {
    const session = await auth();

    if (!session) {
        return getRedirect(request, '/login');
    }

    const requestedSegment = request.nextUrl.pathname.split('/').at(1) ?? '';
    const allowedSegments = rolesRights[session.user.role] ?? [];

    if (allowedSegments.includes(requestedSegment)) {
        return NextResponse.next();
    }

    return getRedirect(request, '/forbidden');
}
