import { prisma } from '@backend/lib/prisma';
import { Notification } from '@backend/generated/prisma';

class NotificationRepository {
    async findAll(filters: {
        userId: number;
        take?: number;
        unreadOnly?: boolean;
    }): Promise<Notification[]> {
        return prisma.notification.findMany({
            where: {
                userId: filters.userId,
                ...(filters.unreadOnly ? { isRead: false } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take: filters.take ?? 10,
        });
    }

    async countUnread(userId: number): Promise<number> {
        return prisma.notification.count({
            where: { userId, isRead: false },
        });
    }

    async markRead(id: number, userId: number): Promise<Notification | null> {
        const notif = await prisma.notification.findFirst({
            where: { id, userId },
        });
        if (!notif) return null;
        return prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    async markAllRead(userId: number): Promise<number> {
        const result = await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        return result.count;
    }

    /**
     * MENTOR создал тред → уведомить STUDENT.
     * Вызывать fire-and-forget: notificationRepository.createForNewThread(...).catch(console.error)
     */
    async createForNewThread(params: {
        recipientId: number;
        actorId: number;
        reviewId: number;
    }): Promise<void> {
        const actor = await prisma.user.findUnique({
            where: { id: params.actorId },
            select: { login: true },
        });

        await prisma.notification.create({
            data: {
                userId: params.recipientId,
                title: 'Новый тред в вашем PR',
                body: `${actor?.login ?? 'Ментор'} оставил комментарий к коду`,
                link: `/review/${params.reviewId}`,
            },
        });
    }

    /**
     * MENTOR написал комментарий → уведомить STUDENT.
     */
    async createForNewComment(params: {
        recipientId: number;
        actorId: number;
        reviewId: number;
    }): Promise<void> {
        const actor = await prisma.user.findUnique({
            where: { id: params.actorId },
            select: { login: true },
        });

        await prisma.notification.create({
            data: {
                userId: params.recipientId,
                title: 'Новый комментарий',
                body: `${actor?.login ?? 'Ментор'} прокомментировал ваш код`,
                link: `/review/${params.reviewId}`,
            },
        });
    }

    /**
     * STUDENT ответил в треде → уведомить MENTOR.
     */
    async createForStudentReply(params: {
        recipientId: number;
        actorId: number;
        reviewId: number;
    }): Promise<void> {
        const actor = await prisma.user.findUnique({
            where: { id: params.actorId },
            select: { login: true },
        });

        await prisma.notification.create({
            data: {
                userId: params.recipientId,
                title: 'Ответ в треде',
                body: `${actor?.login ?? 'Студент'} ответил на комментарий`,
                link: `/review/${params.reviewId}`,
            },
        });
    }
}

export const notificationRepository = new NotificationRepository();
