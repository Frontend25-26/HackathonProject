import { Card, Popup } from '@gravity-ui/uikit';

import { Notification } from '@/entities/notification';

import styles from './Notification.module.css';
import { NotificationItem } from './NotificationItem';

interface NotificationPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    anchorElement: HTMLDivElement | null;
    notifications: Notification[];
}

export const NotificationPopup = ({
    open,
    setOpen,
    anchorElement,
    notifications,
}: NotificationPopupProps) => {
    return (
        <Popup
            anchorElement={anchorElement}
            open={open}
            onOpenChange={setOpen}
            placement="right-end"
        >
            {notifications.length !== 0 ? (
                notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                    />
                ))
            ) : (
                <div className={styles.empty}>Нет уведомлений</div>
            )}
        </Popup>
    );
};
