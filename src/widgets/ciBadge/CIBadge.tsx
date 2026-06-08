import { Ban } from '@gravity-ui/icons';
import { Clock } from '@gravity-ui/icons';
import { Circle } from '@gravity-ui/icons';
import { Check } from '@gravity-ui/icons';
import { Xmark } from '@gravity-ui/icons';
import { Icon, Label } from '@gravity-ui/uikit';
import { FC, SVGProps } from 'react';

import type { CIStatus } from '@/shared/types';

interface Props {
    status: CIStatus;
    size: number;
}

interface ConfigValue {
    icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
    theme: 'unknown' | 'warning' | 'info' | 'success' | 'danger';
}

const CONFIG: Record<CIStatus, ConfigValue> = {
    UNKNOWN: {
        icon: Ban,
        theme: 'unknown',
    },
    PENDING: {
        icon: Clock,
        theme: 'warning',
    },
    RUNNING: {
        icon: Circle,
        theme: 'info',
    },
    SUCCESS: {
        icon: Check,
        theme: 'success',
    },
    FAILURE: {
        icon: Xmark,
        theme: 'danger',
    },
};

export const CIBadge: FC<Props> = ({ status, size }) => {
    const { icon, theme } = CONFIG[status];
    return (
        <Label type={'default'} theme={theme}>
            <Icon data={icon} size={size} />
        </Label>
    );
};
