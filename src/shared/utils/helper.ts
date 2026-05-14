export function transformDate(date: string): string {
    return Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'medium',
    }).format(new Date(date));
}
