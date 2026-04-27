import { CiStatus, Prisma, SubmissionStatus } from '@backend/generated/prisma';
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

type SubmissionWithStudent = Prisma.SubmissionGetPayload<{
    include: typeof studentInclude;
}>;

class SubmissionRepository {
    async findAll(filters?: {
        assignmentId?: number;
        studentId?: number;
    }): Promise<SubmissionWithStudent[]> {
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
    }

    async findById(id: number): Promise<SubmissionWithStudent | null> {
        return prisma.submission.findUnique({
            where: { id },
            include: studentInclude,
        });
    }

    async findByAssignmentAndStudent(
        assignmentId: number,
        studentId: number,
    ): Promise<SubmissionWithStudent | null> {
        return prisma.submission.findUnique({
            where: { assignmentId_studentId: { assignmentId, studentId } },
            include: studentInclude,
        });
    }

    async create(data: {
        repoUrl: string;
        assignmentId: number;
        studentId: number;
    }): Promise<SubmissionWithStudent> {
        return prisma.submission.create({ data, include: studentInclude });
    }

    async update(
        id: number,
        data: {
            repoUrl?: string;
            ciStatus?: CiStatus;
            status?: SubmissionStatus;
        },
    ): Promise<SubmissionWithStudent> {
        return prisma.submission.update({
            where: { id },
            data,
            include: studentInclude,
        });
    }
}

export const submissionRepository = new SubmissionRepository();
