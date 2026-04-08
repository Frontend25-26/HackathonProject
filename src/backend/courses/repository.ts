import { prisma } from '@backend/lib/prisma'

export const courseRepository = {
    findAll() {
        return prisma.course.findMany({ orderBy: { createdAt: 'desc' } })
    },

    findById(id: number) {
        return prisma.course.findUnique({ where: { id } })
    },

    create(data: { title: string; description?: string }) {
        return prisma.course.create({ data })
    },

    update(id: number, data: { title?: string; description?: string }) {
        return prisma.course.update({ where: { id }, data })
    },

    delete(id: number) {
        return prisma.course.delete({ where: { id } })
    },
}
