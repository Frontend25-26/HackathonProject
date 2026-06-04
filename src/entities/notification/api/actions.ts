import { Notification } from '@/entities/notification';
import { apiFetch } from '@/shared/api';

interface getNotificationsProps {
    limit: number;
    unread?: boolean;
}

export const getNotifications = async ({
    limit,
    unread = false,
}: getNotificationsProps): Promise<Notification[]> => {
    return await apiFetch(`/api/notifications`, {
        method: 'GET',
        query: {
            unread,
            limit,
        },
    });
};

export const patchNotification = async (id: number): Promise<void> => {
    await apiFetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
    });
};
