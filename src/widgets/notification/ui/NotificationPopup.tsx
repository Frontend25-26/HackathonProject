import { Button, Popup } from '@gravity-ui/uikit';

import { Notification } from '@/entities/notification';

import styles from './Notification.module.css';
import { NotificationItem } from './NotificationItem';

interface NotificationPopupProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    anchorElement: HTMLDivElement | null;
    notifications: Notification[];
    reload: () => Promise<void>;
    readLocally: (id: number) => void;
    readAll: () => void;
}

export const NotificationPopup = ({
    open,
    setOpen,
    anchorElement,
    notifications,
    readLocally,
    reload,
    readAll,
}: NotificationPopupProps) => {
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
                        onClick={readAll}
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
