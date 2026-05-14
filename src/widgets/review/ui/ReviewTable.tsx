'use client';

import { Table } from '@gravity-ui/uikit';
import { FC } from 'react';

import { Submission } from '@/entities/submission';

import { columns } from '../model/review';

import ReviewTableStyles from './ReviewClient.module.css';

interface ReviewTableProps {
    tableData: Submission[];
}

export const ReviewTable: FC<ReviewTableProps> = ({ tableData }) => {
    return tableData.length === 0 ? (
        <div className={ReviewTableStyles.noData}>
            Нет работ, удовлетворяющих критериям поиска
        </div>
    ) : (
        <Table data={tableData} columns={columns} />
    );
};
