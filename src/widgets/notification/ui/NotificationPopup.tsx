import { Button, Popup } from '@gravity-ui/uikit';

import { Notification, patchAllNotifications } from '@/entities/notification';

import styles from './Notification.module.css';
import { NotificationItem } from './NotificationItem';

interface NotificationPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    anchorElement: HTMLDivElement | null;
    notifications: Notification[];
    reload: () => Promise<void>;
    restore: (snapshot: Notification[]) => void;
    readLocally: (id: number) => void;
    readAllLocally: () => void;
}

export const NotificationPopup = ({
    open,
    setOpen,
    anchorElement,
    notifications,
    readLocally,
    readAllLocally,
    reload,
    restore,
}: NotificationPopupProps) => {
    const handleMarkAll = () => {
        const snapshot = [...notifications];
        try {
            readAllLocally();
            void patchAllNotifications().then(() => reload());
        } catch (_) {
            restore(snapshot);
        }
    };

    return (
        <Popup
            anchorElement={anchorElement}
            open={open}
            onOpenChange={setOpen}
            placement="right-end"
        >
            {notifications.length ? (
                <>
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onRead={readLocally}
                            reload={reload}
                        />
                    ))}
                    <Button
                        size="s"
                        view="flat-action"
                        width="max"
                        onClick={handleMarkAll}
                    >
                        Отметить все как прочитанные
                    </Button>
                </>
            ) : (
                <div className={styles.empty}>Нет уведомлений</div>
            )}
        </Popup>
    );
};
