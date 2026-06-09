import { Table } from '@gravity-ui/uikit';

import { formatDateFromISODate } from '@/shared/utils/helpers';

import { CiBadge } from './CiBadge';

import type { Commits } from '@/shared/types';

const columns = [
    {
        id: 'committedAt',
        name: 'Дата',
        template: (c: Commits) => formatDateFromISODate(c.committedAt),
    },
    { id: 'message', name: 'Сообщение' },
    { id: 'authorName', name: 'Автор' },
    {
        id: 'ciStatus',
        name: 'CI',
        template: (c: Commits) => <CiBadge status={c.ciStatus} />,
    },
];

export const CommitHistory = ({ commits }: { commits: Commits[] }) => {
    return (
        <Table data={commits} columns={columns} emptyMessage="Нет коммитов" />
    );
};
