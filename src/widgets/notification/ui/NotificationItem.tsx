import { Avatar, Checkbox, Link } from '@gravity-ui/uikit';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

import {
    Notification,
    patchNotification,
    useNotificationsPolling,
} from '@/entities/notification';

import styles from './Notification.module.css';

interface Props {
    notification: Notification;
}

export function NotificationItem({ notification }: Props) {
    const { reload } = useNotificationsPolling();

    const handleNotification = async () => {
        await patchNotification(notification.id);
        await reload();
    };

    return (
        <div className={styles.itemWrapper}>
            <div className={styles.userWrapper}>
                <Avatar // TODO после добавления автора для уведомлений
                    text={'no name'}
                    size="s"
                    theme="brand"
                />
                {/*{notification.author.avatar ? (*/}
                {/*<Avatar*/}
                {/*    imgUrl={notification.author.avatar}*/}
                {/*    size="m"*/}
                {/*/>*/}
                {/*) : (*/}
                {/*<Avatar*/}
                {/*    text={notification.author.userName}*/}
                {/*    size="m"*/}
                {/*    theme="brand"*/}
                {/*/>*/}
                {/*)}*/}
            </div>
            <div className={styles.contentWrapper}>
                <Link
                    className={styles.content}
                    href={notification.link}
                    onClick={handleNotification}
                >
                    {notification.title}
                </Link>
                <span className={styles.description}>{notification.body}</span>
                <span className={styles.time}>
                    {formatDistanceToNow(new Date(notification.createdAt), {
                        locale: ru,
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
