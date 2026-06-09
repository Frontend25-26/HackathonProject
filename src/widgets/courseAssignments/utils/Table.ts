import { Table, withTableSorting } from '@gravity-ui/uikit';

import { AssignmentRow } from '@/widgets/courseAssignments/utils/types';

export const TableWithSorting = withTableSorting(Table<AssignmentRow>);
