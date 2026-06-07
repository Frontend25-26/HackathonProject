import { Table } from '@gravity-ui/uikit';

import { formatDateFromISODate } from '@/shared/utils/helpers';

import { CiBadge } from './CiBadge';

import type { Commit } from '@/shared/types/submission';

const columns = [
    {
        id: 'date',
        name: 'Дата',
        template: (c: Commit) => formatDateFromISODate(c.committedAt), // используем committedAt
    },
    {
        id: 'message',
        name: 'Сообщение',
        template: (c: Commit) => c.message,
    },
    {
        id: 'author',
        name: 'Автор',
        template: (c: Commit) => c.authorName,
    },
    {
        id: 'ci',
        name: 'CI',
        template: (c: Commit) => <CiBadge status={c.ciStatus} />,
    },
];

export const CommitHistory = ({ commits }: { commits: Commit[] }) => {
    return (
        <Table data={commits} columns={columns} emptyMessage="Нет коммитов" />
    );
};
