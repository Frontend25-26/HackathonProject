import { prisma } from '@backend/lib/prisma';

export const assignmentRepository = {
    findAll(filters?: { courseId?: number }) {
        return prisma.assignment.findMany({
            where: filters?.courseId
                ? { courseId: filters.courseId }
                : undefined,
            orderBy: { createdAt: 'desc' },
        });
    },

    findById(id: number) {
        return prisma.assignment.findUnique({ where: { id } });
    },

    create(data: {
        title: string;
        description: string;
        classroomUrl: string;
        maxGrade: number;
        dueDate: Date;
        courseId: number;
        createdById: number;
    }) {
        return prisma.assignment.create({ data });
    },

    update(
        id: number,
        data: {
            title?: string;
            description?: string;
            classroomUrl?: string;
            maxGrade?: number;
            dueDate?: Date;
        },
    ) {
        return prisma.assignment.update({ where: { id }, data });
    },

    delete(id: number) {
        return prisma.assignment.delete({ where: { id } });
    },
};
