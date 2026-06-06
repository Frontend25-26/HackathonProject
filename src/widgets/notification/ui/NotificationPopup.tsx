import { Popup } from '@gravity-ui/uikit';

import { Notification } from '@/entities/notification';

import styles from './Notification.module.css';
import { NotificationItem } from './NotificationItem';

interface NotificationPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    anchorElement: HTMLDivElement | null;
    notifications: Notification[];
    reload: () => Promise<void>;
    markAsReadLocally: (id: number) => void;
}

export const NotificationPopup = ({
    open,
    setOpen,
    anchorElement,
    notifications,
    markAsReadLocally,
    reload,
}: NotificationPopupProps) => {
    return (
        <Popup
            anchorElement={anchorElement}
            open={open}
            onOpenChange={setOpen}
            placement="right-end"
        >
            {notifications.length ? (
                notifications
                    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                    .map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onRead={markAsReadLocally}
                            reload={reload}
                        />
                    ))
            ) : (
                <div className={styles.empty}>Нет уведомлений</div>
            )}
        </Popup>
    );
};
