import {
    Table,
    TableDataItem,
    TableProps,
    withTableSorting,
} from '@gravity-ui/uikit';
import { ComponentType } from 'react';

/**
 * Явный проброс типа для TableWithSorting, чтобы не указывать его при каждом использовании
 *
 * example
 *
 * type UserRow = User
 *
 * const UsersTable = TableWithSorting<UserRow>();
 *
 * return (
 *   <UsersTable
 *    data={users}
 *   />
 * )
 */
export function TableWithSorting<
    RowType extends TableDataItem,
>(): ComponentType<TableProps<RowType>> {
    return withTableSorting(Table<RowType>);
}
