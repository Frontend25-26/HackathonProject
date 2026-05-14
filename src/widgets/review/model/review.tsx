import { TableColumnConfig } from '@gravity-ui/uikit';

import { Submission } from '@/entities/submission';
import { transformDate } from '@/shared/utils/helper';

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
    course: string | null;
    deadline: string | null;
    ciStatus: string | null;
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
        filterName: 'course',
    },
    {
        propertyName: 'Deadline',
        title: 'Дедлайн',
        filterName: 'deadline',
    },
    {
        propertyName: 'CIStatus',
        title: 'CI',
        filterName: 'ciStatus',
    },
];
