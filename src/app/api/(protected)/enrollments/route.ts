/**
 * GET /api/enrollments — список зачислений (фильтр по courseId / studentId)
 *
 * STUDENT видит только свои зачисления; MENTOR/ADMIN видят все.
 */

import { NextRequest } from 'next/server'

import { enrollmentRepository } from '@backend/enrollments/repository'
import { Role } from '@backend/generated/prisma'
import { requireAuth } from '@backend/lib/auth'

export async function GET(request: NextRequest) {
    const auth = await requireAuth(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const courseId = searchParams.get('courseId')

    // STUDENT видит только свои зачисления
    const studentIdParam =
        auth.user.role === Role.STUDENT
            ? auth.user.id
            : searchParams.get('studentId')
              ? Number(searchParams.get('studentId'))
              : undefined

    const enrollments = await enrollmentRepository.findAll({
        ...(courseId && { courseId: Number(courseId) }),
        ...(studentIdParam !== undefined && { studentId: studentIdParam }),
    })

    return Response.json(enrollments)
}
