'use client';

import { Table } from '@gravity-ui/uikit';
import { FC } from 'react';

import { DisplayedSubmission } from '@/entities/submission';

import { columns } from '../../model/review';

import styles from './ReviewTable.module.css';

interface ReviewTableProps {
    tableData: DisplayedSubmission[];
}

export const ReviewTable: FC<ReviewTableProps> = ({ tableData }) => {
    return tableData.length === 0 ? (
        <div className={styles.noData}>
            Нет работ, удовлетворяющих критериям поиска
        </div>
    ) : (
        <Table data={tableData} columns={columns} />
    );
};
