import { Checkbox, Link } from '@gravity-ui/uikit';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Notification, patchNotification } from '@/entities/notification';

import styles from './Notification.module.css';
import { NotificationAvatar } from './NotificationAvatar';

interface Props {
    notification: Notification;
    reload: () => Promise<void>;
    onRead: (id: number) => void;
}

export function NotificationItem({ notification, reload, onRead }: Props) {
    const handleNotification = async () => {
        if (!notification.isRead) {
            onRead(notification.id);

            void patchNotification(notification.id).then(() => reload());
        }
    };

    return (
        <div className={styles.itemWrapper}>
            <div className={styles.userWrapper}>
                <NotificationAvatar source={notification.source} />
            </div>
            <div className={styles.contentWrapper}>
                <Link
                    className={styles.title}
                    href={notification.link}
                    onClick={handleNotification}
                >
                    {notification.title}
                </Link>
                <span className={styles.description}>{notification.body}</span>
                <span className={styles.time}>
                    {formatDistanceToNow(new Date(notification.createdAt), {
                        locale: ru,
                        addSuffix: true,
                    })}
                </span>
                <Checkbox
                    className={styles.checkboxWrapper}
                    checked={notification.isRead}
                    onChange={handleNotification}
                />
            </div>
        </div>
    );
}
