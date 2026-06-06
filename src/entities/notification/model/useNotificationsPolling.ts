import { useCallback, useEffect, useState } from 'react';

import { Notification } from '@/entities/notification';
import { getNotifications } from '@/entities/notification/api/actions';

export function useNotificationsPolling() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const markAsReadLocally = (id: number) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification,
            ),
        );
    };

    const markAllAsReadLocally = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({
                ...notification,
                isRead: true,
            })),
        );
    };

    const restoreNotifications = (snapshot: Notification[]) => {
        setNotifications(snapshot);
    };

    const loadNotifications = useCallback(async () => {
        setNotifications(await getNotifications({ limit: 10, unread: true }));
    }, []);

    useEffect(() => {
        queueMicrotask(() => loadNotifications());
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, [loadNotifications]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
        notifications,
        unreadCount,
        reload: loadNotifications,
        restore: restoreNotifications,
        readLocally: markAsReadLocally,
        readAllLocally: markAllAsReadLocally,
    };
}
