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

    const loadNotifications = useCallback(async () => {
        setNotifications(await getNotifications({ limit: 10 }));
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
        markAsReadLocally,
    };
}
