import {
    format,
    formatDistanceToNow,
    differenceInDays,
    differenceInMinutes,
    isValid,
    parseISO,
} from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDueDate = (date: string): string => {
    if (!date) return '—';

    try {
        const dueDate = parseISO(date);
        if (!isValid(dueDate)) return '—';

        const now = new Date();
        const daysDiff = differenceInDays(dueDate, now);
        const absDays = Math.abs(daysDiff);
        const minutesDiff = differenceInMinutes(dueDate, now);
        const absMinutes = Math.abs(minutesDiff);

        if (absDays > 7) {
            return format(dueDate, 'dd.MM, HH:mm', { locale: ru });
        }

        if (absMinutes < 60 && absDays === 0) {
            const minutes = absMinutes;
            const suffix = dueDate < now ? ' назад' : '';
            const prefix = dueDate < now ? '' : 'через ';

            if (minutes === 0) {
                return dueDate < now ? 'только что' : 'меньше минуты';
            }

            const minutesText = `${minutes} ${getMinutesEnding(minutes)}`;
            return `${prefix}${minutesText}${suffix}`;
        }
        return formatDistanceToNow(dueDate, { locale: ru, addSuffix: true });
    } catch {
        return '—';
    }
};

function getMinutesEnding(minutes: number): string {
    const last = minutes % 10;
    if (last === 1) return 'минуту';
    if (last >= 2 && last <= 4) return 'минуты';
    return 'минут';
}
