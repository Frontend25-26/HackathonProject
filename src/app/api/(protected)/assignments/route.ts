import { NextRequest } from 'next/server';

import { assignmentRepository } from '@backend/assignments/repository';
import { CreateAssignmentSchema } from '@backend/assignments/schema';
import { classroomApi } from '@backend/github/classroom';
import { requireAuth, requireAdmin } from '@backend/lib/auth';
import { userRepository } from '@backend/users/repository';

export const GET = async (request: NextRequest): Promise<Response> => {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { searchParams } = request.nextUrl;
    const courseId = searchParams.get('courseId');

    const assignments = await assignmentRepository.findAll(
        courseId ? { courseId: Number(courseId) } : undefined,
    );

    return Response.json(assignments);
};

export const POST = async (request: NextRequest): Promise<Response> => {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body: unknown = await request.json();
    const parsed = CreateAssignmentSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 });
    }

    const { classroomAssignmentId, ...rest } = parsed.data;

    let title = rest.title;
    let classroomUrl = rest.classroomUrl;
    let inviteLink: string | null = null;
    let dueDate: Date | undefined = rest.dueDate
        ? new Date(rest.dueDate)
        : undefined;

    if (classroomAssignmentId) {
        const dbUser = await userRepository.findById(auth.user.id);
        const ghAssignment = await classroomApi
            .getAssignment(
                classroomAssignmentId,
                dbUser?.githubToken ?? undefined,
            )
            .catch(() => null);

        if (ghAssignment) {
            title = title ?? ghAssignment.title;
            classroomUrl = classroomUrl ?? ghAssignment.classroom.url;
            inviteLink = ghAssignment.invite_link;
            if (!dueDate && ghAssignment.deadline) {
                dueDate = new Date(ghAssignment.deadline);
            }
        }
    }

    if (!title) {
        return Response.json(
            { error: 'title обязателен, если не задан classroomAssignmentId' },
            { status: 400 },
        );
    }
    if (!classroomUrl) {
        return Response.json(
            {
                error: 'classroomUrl обязателен, если не задан classroomAssignmentId',
            },
            { status: 400 },
        );
    }
    if (!dueDate) {
        return Response.json({ error: 'dueDate обязателен' }, { status: 400 });
    }

    const assignment = await assignmentRepository.create({
        title,
        description: rest.description ?? '',
        classroomUrl,
        classroomAssignmentId: classroomAssignmentId ?? null,
        inviteLink,
        maxGrade: rest.maxGrade,
        dueDate,
        courseId: rest.courseId,
        createdById: rest.createdById,
    });

    return Response.json(assignment, { status: 201 });
};
