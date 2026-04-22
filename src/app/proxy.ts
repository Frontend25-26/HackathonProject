import { Session } from 'next-auth'

import { Roles } from '@/app/shared/types/roles'
import { auth } from '@/auth/authSetup'
import { userRepository } from '@backend/users/repository'

import type { NextRequest } from 'next/server'

export const config = {
    matcher: ['/admin/:path*', '/mentor/:path*', '/student/:path*'],
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
            return
        }
    }
    const errorMessage = 'Reading ' + url + ' cannot be done with role ' + role
    return Response.json(
        { success: false, message: errorMessage },
        { status: 403 },
    )
}
