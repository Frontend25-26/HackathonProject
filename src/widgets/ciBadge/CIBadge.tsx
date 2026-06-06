import { Ban } from '@gravity-ui/icons';
import { Clock } from '@gravity-ui/icons';
import { Circle } from '@gravity-ui/icons';
import { Check } from '@gravity-ui/icons';
import { Xmark } from '@gravity-ui/icons';
import { Icon } from '@gravity-ui/uikit';
import { FC } from 'react';

import styles from './CIBadge.module.css';

interface Props {
    status: 'UNKNOWN' | 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE';
    size: number;
}

const CONFIG = {
    UNKNOWN: {
        icon: Ban,
        className: styles.unknown,
    },
    PENDING: {
        icon: Clock,
        className: styles.pending,
    },
    RUNNING: {
        icon: Circle,
        className: styles.running,
    },
    SUCCESS: {
        icon: Check,
        className: styles.success,
    },
    FAILURE: {
        icon: Xmark,
        className: styles.failure,
    },
};

export const CIBadge: FC<Props> = ({ status, size }) => {
    const { icon, className } = CONFIG[status];

    return <Icon data={icon} className={className} size={size} />;
};
