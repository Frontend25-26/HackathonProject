import { TableColumnConfig } from '@gravity-ui/uikit';

import { DisplayedSubmission } from '@/entities/submission';
import { formatDateFromISODate } from '@/shared/utils/helpers';

export const columns: TableColumnConfig<DisplayedSubmission>[] = [
    {
        id: 'student',
        name: 'Студент',
    },
    {
        id: 'course',
        name: 'Курс',
    },
    {
        id: 'hw',
        name: 'ДЗ',
    },
    {
        id: 'deadline',
        name: 'Дедлайн',
        template: (item) => formatDateFromISODate(item.deadline),
    },
    {
        id: 'ciStatus',
        name: 'CI-статус',
    },
    {
        id: 'lastCommitDate',
        name: 'Дата последнего коммита',
        template: (item) => formatDateFromISODate(item.lastCommitDate),
    },
    {
        id: 'repositoryUrl',
        name: 'Ссылка на репозиторий',
        template: (item) => (
            <a href={item.repositoryUrl} target="_blank" rel="noreferrer">
                {item.repositoryUrl}
            </a>
        ),
    },
];

export interface Filter {
    course: string | null;
    deadline: string | null;
    ciStatus: string | null;
}

export interface FilterProperties {
    propertyName: keyof DisplayedSubmission;
    title: string;
    filterName: keyof Filter;
}

export const filtersData: FilterProperties[] = [
    {
        propertyName: 'course',
        title: 'Курс',
        filterName: 'course',
    },
    {
        propertyName: 'deadline',
        title: 'Дедлайн',
        filterName: 'deadline',
    },
    {
        propertyName: 'ciStatus',
        title: 'CI',
        filterName: 'ciStatus',
    },
];
