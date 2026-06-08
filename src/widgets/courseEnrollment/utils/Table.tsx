import { Table, withTableSorting } from '@gravity-ui/uikit';

import { CourseStudentRow } from '@/entities/courseEnrollment';

export const TableWithSorting = withTableSorting(Table<CourseStudentRow>);
