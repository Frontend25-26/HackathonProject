import { CiStatus, SubmissionStatus } from '@backend/generated/prisma';
import { prisma } from '@backend/lib/prisma';

const studentInclude = {
    student: {
        select: {
            id: true,
            name: true,
            login: true,
            avatar: true,
        },
    },
} as const;

export const submissionRepository = {
    findAll(filters?: { assignmentId?: number; studentId?: number }) {
        return prisma.submission.findMany({
            where: {
                ...(filters?.assignmentId && {
                    assignmentId: filters.assignmentId,
                }),
                ...(filters?.studentId && { studentId: filters.studentId }),
            },
            include: studentInclude,
            orderBy: { createdAt: 'desc' },
        });
    },

    findById(id: number) {
        return prisma.submission.findUnique({
            where: { id },
            include: studentInclude,
        });
    },

    findByAssignmentAndStudent(assignmentId: number, studentId: number) {
        return prisma.submission.findUnique({
            where: { assignmentId_studentId: { assignmentId, studentId } },
        });
    },

    create(data: { repoUrl: string; assignmentId: number; studentId: number }) {
        return prisma.submission.create({ data });
    },

    update(
        id: number,
        data: {
            repoUrl?: string;
            ciStatus?: CiStatus;
            status?: SubmissionStatus;
        },
    ) {
        return prisma.submission.update({ where: { id }, data });
    },
};
