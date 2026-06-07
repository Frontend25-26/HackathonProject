import { Label } from '@gravity-ui/uikit';

const STATUS_MAP: Record<string, { text: string; theme: 'info' | 'success' | 'warning' | 'danger' }> = {
    SUCCESS: { text: 'Успешно', theme: 'success' },
    FAILURE: { text: 'Ошибка', theme: 'danger' },
    RUNNING: { text: 'Запущен', theme: 'warning' },
    PENDING: { text: 'Ожидает', theme: 'warning' },
    UNKNOWN: { text: 'Нет данных', theme: 'info' },
    PASSED: { text: 'Успешно', theme: 'success' },
};

export const CiBadge = ({ status }: { status: string }) => {
    const { text, theme } = STATUS_MAP[status] ?? STATUS_MAP.UNKNOWN;
    return <Label theme={theme}>{text}</Label>;
};