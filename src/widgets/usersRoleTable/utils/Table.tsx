import { Table, withTableSorting } from '@gravity-ui/uikit';

import { UserTableRow } from '@/widgets/usersRoleTable/utils/types';

export const TableWithSorting = withTableSorting(Table<UserTableRow>);
