import { User } from '@gravity-ui/uikit';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

import { Notification, patchNotification } from '@/entities/notification';

import styles from './Notification.module.css';

interface Props {
    notification: Notification;
}

export function NotificationItem({ notification }: Props) {
    const router = useRouter();

    const handleClick = async () => {
        await patchNotification(notification.id);
        router.push(notification.link);
    };

    return (
        <button type="button" onClick={handleClick} className={styles.item}>
            <div className={styles.userWrapper}>
                <User
                    avatar={{ text: 'no name', theme: 'brand' }} // TODO после добавления автора для уведомлений
                    size="s"
                    name={notification.title}
                    description={
                        <span className={styles.description}>
                            {notification.body}
                        </span>
                    }
                />
            </div>

            <span className={styles.time}>
                {formatDistanceToNow(new Date(notification.createdAt), {
                    locale: ru,
                })}
            </span>

            {!notification.isRead && <div className={styles.unread} />}
        </button>
    );
}
