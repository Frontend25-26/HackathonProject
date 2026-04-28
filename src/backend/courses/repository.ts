import { prisma } from '@backend/lib/prisma';
import { Course } from '@backend/generated/prisma';

class CourseRepository {
    async findAll(): Promise<Course[]> {
        return prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async findById(id: number): Promise<Course | null> {
        return prisma.course.findUnique({ where: { id } });
    }

    async create(data: { title: string }): Promise<Course> {
        return prisma.course.create({ data });
    }

    async update(id: number, data: { title?: string }): Promise<Course> {
        return prisma.course.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Course> {
        return prisma.course.delete({ where: { id } });
    }
}

export const courseRepository = new CourseRepository();
