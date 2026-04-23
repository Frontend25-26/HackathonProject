import { prisma } from '@backend/lib/prisma';

export const enrollmentRepository = {
    findAll(filters?: { courseId?: number; studentId?: number }) {
        return prisma.enrollment.findMany({
            where: {
                ...(filters?.courseId && { courseId: filters.courseId }),
                ...(filters?.studentId && { studentId: filters.studentId }),
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    findById(id: number) {
        return prisma.enrollment.findUnique({ where: { id } });
    },

    findByCourseAndStudent(courseId: number, studentId: number) {
        return prisma.enrollment.findUnique({
            where: { courseId_studentId: { courseId, studentId } },
        });
    },

    create(data: { courseId: number; studentId: number; mentorId?: number }) {
        return prisma.enrollment.create({ data });
    },

    update(id: number, data: { mentorId?: number }) {
        return prisma.enrollment.update({
            where: { id },
            data,
        });
    },

    delete(id: number) {
        return prisma.enrollment.delete({ where: { id } });
    },
};
