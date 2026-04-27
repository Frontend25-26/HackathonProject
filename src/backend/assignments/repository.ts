import { prisma } from '@backend/lib/prisma';
import { Assignment } from '@backend/generated/prisma';

class AssignmentRepository {
    async findAll(filters?: { courseId?: number }): Promise<Assignment[]> {
        return prisma.assignment.findMany({
            where: filters?.courseId
                ? { courseId: filters.courseId }
                : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: number): Promise<Assignment | null> {
        return prisma.assignment.findUnique({ where: { id } });
    }

    async create(data: {
        title: string;
        description: string;
        classroomUrl: string;
        maxGrade: number;
        dueDate: Date;
        courseId: number;
        createdById: number;
    }): Promise<Assignment> {
        return prisma.assignment.create({ data });
    }

    async update(
        id: number,
        data: {
            title?: string;
            description?: string;
            classroomUrl?: string;
            maxGrade?: number;
            dueDate?: Date;
        },
    ): Promise<Assignment> {
        return prisma.assignment.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Assignment> {
        return prisma.assignment.delete({ where: { id } });
    }
}

export const assignmentRepository = new AssignmentRepository();
