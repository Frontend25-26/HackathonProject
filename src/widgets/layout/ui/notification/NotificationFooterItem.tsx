import { Bell } from '@gravity-ui/icons';
import { FooterItem } from '@gravity-ui/navigation';
import { FC, useState } from 'react';

import { useNotificationsPolling } from '@/entities/notification';
import { NotificationPopup } from '@/widgets/notification';

import styles from './NotificationFooterItem.module.css';

interface NotificationFooterItemProps {
    compact: boolean;
}

export const NotificationFooterItem: FC<NotificationFooterItemProps> = ({
    compact,
}) => {
    const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(
        null,
    );
    const [open, setOpen] = useState(false);

    const { unreadCount, notifications } = useNotificationsPolling();

    return (
        <FooterItem
            id="notifications"
            compact={compact}
            title="Уведомления"
            icon={Bell}
            itemWrapper={(params, makeItem) => {
                return (
                    <>
                        <div
                            ref={setAnchorElement}
                            onClick={() => setOpen(!open)}
                        >
                            {makeItem({
                                ...params,
                                icon: (
                                    <div className={styles.iconWrapper}>
                                        <Bell />
                                        {unreadCount !== 0 && (
                                            <span className={styles.badge}>
                                                {unreadCount < 99
                                                    ? unreadCount
                                                    : '99+'}
                                            </span>
                                        )}
                                    </div>
                                ),
                            })}
                        </div>
                        <NotificationPopup
                            open={open}
                            setOpen={setOpen}
                            anchorElement={anchorElement}
                            notifications={notifications}
                        />
                    </>
                );
            }}
        />
    );
};
