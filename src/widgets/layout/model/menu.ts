import { ListCheck, ListUl, Persons } from '@gravity-ui/icons';

import type { Role } from '@/entities/user';
import type { IconProps } from '@gravity-ui/uikit';

export interface MenuItemConfig {
    id: string;
    title: string;
    icon: IconProps['data'];
    visibleRoles: Role[];
    href?: string;
    type?: 'action';
}

export const primaryMenu: MenuItemConfig[] = [
    {
        id: 'assignments',
        title: 'Задания',
        icon: ListUl,
        visibleRoles: ['STUDENT'],
        href: '/student/assignments',
    },
    {
        id: 'students',
        title: 'Студенты',
        icon: Persons,
        visibleRoles: ['ADMIN'],
    },
    {
        id: 'courses',
        title: 'Список курсов',
        icon: ListUl,
        visibleRoles: ['ADMIN'],
        href: '/admin/courses',
    },
    {
        id: 'courses',
        title: 'Список Курсов',
        icon: ListUl,
        visibleRoles: ['STUDENT'],
        href: '/student/courses',
    },
    {
        id: 'review',
        title: 'Проверка заданий',
        icon: ListCheck,
        visibleRoles: ['MENTOR', 'ADMIN'],
        href: '/mentor/review',
    },
];

export const secondaryMenu: MenuItemConfig[] = [];
