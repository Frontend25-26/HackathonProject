import {
    CircleQuestion,
    Dots9,
    Gear,
    GraduationCap,
    ListCheck,
    ListUl,
    Persons,
} from '@gravity-ui/icons';

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

const ALL_ROLES: Role[] = ['STUDENT', 'MENTOR', 'ADMIN'];

export const primaryMenu: MenuItemConfig[] = [
    { id: 'dashboard', title: 'Дашборд', icon: Dots9, visibleRoles: ALL_ROLES },
    {
        id: 'assignments',
        title: 'Задания',
        icon: ListUl,
        visibleRoles: ['STUDENT'],
        href: '/student/assignments',
    },
    {
        id: 'mentors',
        title: 'Менторы',
        icon: GraduationCap,
        visibleRoles: ['ADMIN'],
    },
    {
        id: 'students',
        title: 'Студенты',
        icon: Persons,
        visibleRoles: ['ADMIN'],
    },
    {
        id: 'review',
        title: 'Проверка заданий',
        icon: ListCheck,
        visibleRoles: ['MENTOR', 'ADMIN'],
        href: '/mentor/review',
    },
    {
        id: 'courses',
        title: 'Список курсов',
        icon: ListUl,
        visibleRoles: ['STUDENT'],
        href: '/student/courses',
    },
];

export const secondaryMenu: MenuItemConfig[] = [
    { id: 'faq', title: 'FAQ', icon: CircleQuestion, visibleRoles: ALL_ROLES },
    {
        id: 'settings',
        title: 'Настройки',
        icon: Gear,
        visibleRoles: ['ADMIN'],
        href: '/admin/classrooms',
    },
];
