import { prisma } from '@backend/lib/prisma';
import { Enrollment } from '@backend/generated/prisma';

class EnrollmentRepository {
    async findAll(filters?: {
        courseId?: number;
        studentId?: number;
    }): Promise<Enrollment[]> {
        return prisma.enrollment.findMany({
            where: {
                ...(filters?.courseId && { courseId: filters.courseId }),
                ...(filters?.studentId && { studentId: filters.studentId }),
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: number): Promise<Enrollment | null> {
        return prisma.enrollment.findUnique({ where: { id } });
    }

    async findByCourseAndStudent(
        courseId: number,
        studentId: number,
    ): Promise<Enrollment | null> {
        return prisma.enrollment.findUnique({
            where: { courseId_studentId: { courseId, studentId } },
        });
    }

    async create(data: {
        courseId: number;
        studentId: number;
        mentorId?: number;
    }): Promise<Enrollment> {
        return prisma.enrollment.create({ data });
    }

    async update(id: number, data: { mentorId?: number }): Promise<Enrollment> {
        return prisma.enrollment.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Enrollment> {
        return prisma.enrollment.delete({ where: { id } });
    }
}

export const enrollmentRepository = new EnrollmentRepository();
