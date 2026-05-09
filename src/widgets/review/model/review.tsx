import { Submission } from '@/entities/submission';

import type {
    CellContext,
    ColumnDef,
} from '@gravity-ui/table/build/esm/tanstack';

function transformDate(date: string): string {
    return Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'short',
        timeStyle: 'medium',
    }).format(new Date(date));
}

export const columns: ColumnDef<Submission>[] = [
    { accessorKey: 'Student', header: 'Студент', size: 150 },
    { accessorKey: 'Course', header: 'Курс', size: 100 },
    { accessorKey: 'HW', header: 'ДЗ', size: 150 },
    {
        accessorKey: 'Deadline',
        header: 'Дедлайн',
        cell: (item: CellContext<Submission, string>) => {
            return <div>{transformDate(item.getValue())}</div>;
        },
        size: 170,
    },
    { accessorKey: 'CIStatus', header: 'CI-статус', size: 150 },
    {
        accessorKey: 'LastCommitDate',
        header: 'Дата последнего коммита',
        cell: (item: CellContext<Submission, string>) => {
            return <div>{transformDate(item.getValue())}</div>;
        },
        size: 170,
    },
    {
        accessorKey: 'RepositoryUrl',
        header: 'Ссылка на репозиторий',
        cell: (item: CellContext<Submission, string>) => {
            return <a href={item.getValue()}>{item.getValue()}</a>;
        },
        size: 250,
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
