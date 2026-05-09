'use client';
import { Table, useTable } from '@gravity-ui/table';
import { FC, useState } from 'react';

import { Submission } from '@/entities/submission';

import { columns } from '../model/review';

import ReviewTableStyles from './ReviewTableStyles.module.css';

import type { SortingState } from '@gravity-ui/table/tanstack';

interface ReviewTableProps {
    tableData: Submission[];
}

export const ReviewTable: FC<ReviewTableProps> = ({ tableData }) => {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'LastCommitDate',
            desc: true,
        },
    ]);

    const table = useTable({
        columns,
        data: tableData,
        enableSorting: true,
        getRowId: (item) => item.id,
        onSortingChange: setSorting,
        state: {
            sorting: sorting,
        },
    });

    return tableData.length === 0 ? (
        <div className={ReviewTableStyles.noData}>
            Нет работ, удовлетворяющих критериям поиска
        </div>
    ) : (
        <Table table={table} />
    );
};
