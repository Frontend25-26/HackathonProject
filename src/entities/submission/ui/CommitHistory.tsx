import { Table } from '@gravity-ui/uikit';

import { formatDateFromISODate } from '@/shared/utils/helpers';

import { CiBadge } from './CiBadge';

import type { Commit } from '@/shared/types/submission';

const columns = [
    {
        id: 'committedAt',
        name: 'Дата',
        template: (c: Commit) => formatDateFromISODate(c.committedAt),
    },
    { id: 'message', name: 'Сообщение' },
    { id: 'authorName', name: 'Автор' },
    {
        id: 'ciStatus',
        name: 'CI',
        template: (c: Commit) => <CiBadge status={c.ciStatus} />,
    },
];

export const CommitHistory = ({ commits }: { commits: Commit[] }) => {
    return (
        <Table data={commits} columns={columns} emptyMessage="Нет коммитов" />
    );
};
