import type { NextRequest } from 'next/server'

enum Roles {
    Admin,
    Mentor,
    Student
}

export const config = {
    matcher: ['/admin/:path*',
        '/mentor/:path*',
        '/student/:path*'],
}

const rolesNames = {
    [Roles.Admin] : "admin",
    [Roles.Mentor] : "mentor",
    [Roles.Student] : "student"
}

const rolesMatcher = {
    [Roles.Admin] : ["admin"],
    [Roles.Mentor] : ["mentor"],
    [Roles.Student] : ["student"]
}

export function proxy(request: NextRequest) {

    const url = request.nextUrl.pathname;
    const role = Roles.Student;

    const requiredRole = url.split("/").at(1);

    for (const possibleRole in rolesMatcher[role]) {
        if (requiredRole === rolesMatcher[role][possibleRole]) {
            return;
        }
    }
    const errorMessage = 'Reading ' + url + ' cannot be done with role ' + rolesNames[role];
    return Response.json(
        { success: false, message: errorMessage },
        { status: 403 }
    )

}