import { prisma } from '@backend/lib/prisma';

export const courseRepository = {
    async findAll() {
        return await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
    },

    async findById(id: number) {
        return await prisma.course.findUnique({ where: { id } });
    },

    async create(data: { title: string }) {
        return await prisma.course.create({ data });
    },

    async update(id: number, data: { title?: string }) {
        return await prisma.course.update({ where: { id }, data });
    },

    async delete(id: number) {
        return await prisma.course.delete({ where: { id } });
    },
};
