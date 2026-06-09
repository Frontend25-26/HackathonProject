import { Label } from '@gravity-ui/uikit';

import { CiStatus } from '@/shared/types';

type LabelTheme =
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'normal'
    | 'utility'
    | 'unknown'
    | 'clear';

const STATUS_MAP: Record<CiStatus, { text: string; theme: LabelTheme }> = {
    [CiStatus.SUCCESS]: { text: 'Успешно', theme: 'success' },
    [CiStatus.FAILURE]: { text: 'Ошибка', theme: 'danger' },
    [CiStatus.RUNNING]: { text: 'Запущен', theme: 'warning' },
    [CiStatus.PENDING]: { text: 'Ожидает', theme: 'warning' },
    [CiStatus.UNKNOWN]: { text: 'Нет данных', theme: 'info' },
};

export const CiBadge = ({ status }: { status: CiStatus }) => {
    const { text, theme } = STATUS_MAP[status] ?? STATUS_MAP[CiStatus.UNKNOWN];
    return <Label theme={theme}>{text}</Label>;
};
