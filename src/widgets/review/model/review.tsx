import { TableColumnConfig } from '@gravity-ui/uikit';

import { Submission } from '@/entities/submission';

function transformDate(date: string): string {
    return Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'medium',
    }).format(new Date(date));
}

export const columns: TableColumnConfig<Submission>[] = [
    {
        id: 'Student',
        name: 'Студент',
    },
    {
        id: 'Course',
        name: 'Курс',
    },
    {
        id: 'HW',
        name: 'ДЗ',
    },
    {
        id: 'Deadline',
        name: 'Дедлайн',
        template: (item) => transformDate(item.Deadline),
    },
    {
        id: 'CIStatus',
        name: 'CI-статус',
    },
    {
        id: 'LastCommitDate',
        name: 'Дата последнего коммита',
        template: (item) => transformDate(item.LastCommitDate),
    },
    {
        id: 'RepositoryUrl',
        name: 'Ссылка на репозиторий',
        template: (item) => (
            <a href={item.RepositoryUrl} target="_blank" rel="noreferrer">
                {item.RepositoryUrl}
            </a>
        ),
    },
];

export interface Filter {
    Course: string | null;
    Deadline: string | null;
    CIStatus: string | null;
}

export interface FilterProperties {
    propertyName: keyof Submission;
    title: string;
    filterName: keyof Filter;
}

export const filtersData: FilterProperties[] = [
    {
        propertyName: 'Course',
        title: 'Курс',
        filterName: 'Course',
    },
    {
        propertyName: 'Deadline',
        title: 'Дедлайн',
        filterName: 'Deadline',
    },
    {
        propertyName: 'CIStatus',
        title: 'CI',
        filterName: 'CIStatus',
    },
];
