import { useCallback, useEffect, useState } from 'react';

import { Notification, patchAllNotifications } from '@/entities/notification';
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

    const loadNotifications = useCallback(async () => {
        setNotifications(await getNotifications({ limit: 10, unread: true }));
    }, []);

    const markAllAsRead = useCallback(async () => {
        const snapshot = [...notifications];

        markAllAsReadLocally();
        try {
            await patchAllNotifications();
            await loadNotifications();
        } catch {
            setNotifications(snapshot);
        }
    }, [notifications, loadNotifications]);

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
        readLocally: markAsReadLocally,
        readAll: markAllAsRead,
    };
}
