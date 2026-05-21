import { ReactNode } from 'react';

import { Course } from '@/entities/course';

export type CourseTableProps = {
    courses: Course[];
    onEditAction: (id: number, title: string) => void;
    onDeleteAction: (id: number) => void;
};

export type CourseColumnDef = {
    id: keyof Course;
    name: string;
    template?: (item: Course) => ReactNode;
};
