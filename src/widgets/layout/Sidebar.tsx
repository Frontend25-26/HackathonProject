import {
    ArrowRightFromSquare,
    CircleQuestion,
    Dots9,
    Gear,
    GraduationCap,
    ListUl,
    Persons,
} from '@gravity-ui/icons'
import { AsideHeader, AsideHeaderItem } from '@gravity-ui/navigation'
import { IconProps } from '@gravity-ui/uikit'
import { FC, ReactNode } from 'react'
import { MouseEvent } from 'react'

import { Roles } from '@/shared/types/roles'

import { UserProps } from './layoutContent'

interface SidebarElement {
    icon: IconProps['data']
    text: string
    visibleRoles: Roles[]
    onClick: (
        item: AsideHeaderItem,
        collapsed: boolean,
        event: MouseEvent,
    ) => void
}

export const Sidebar: FC<{
    user: UserProps | null
    mainContent: ReactNode
}> = ({ user, mainContent }) => {
    if (!user) {
        return mainContent
    }
    const role = user.role

    const upperSidebarData: SidebarElement[] = [
        {
            icon: Dots9,
            text: 'Панель',
            visibleRoles: [Roles.Student, Roles.Mentor, Roles.Admin],
            onClick: () => {},
        },
        {
            icon: ListUl,
            text: 'Задания',
            visibleRoles: [Roles.Student, Roles.Mentor, Roles.Admin],
            onClick: () => {},
        },
        {
            icon: GraduationCap,
            text: 'Менторы',
            visibleRoles: [Roles.Admin],
            onClick: () => {},
        },
        {
            icon: Persons,
            text: 'Студенты',
            visibleRoles: [Roles.Admin],
            onClick: () => {},
        },
        {
            icon: Gear,
            text: 'Настройки',
            visibleRoles: [Roles.Student, Roles.Mentor, Roles.Admin],
            onClick: () => {},
        },
    ]

    const lowerSidebarData: SidebarElement[] = [
        {
            icon: CircleQuestion,
            text: 'FAQ',
            visibleRoles: [Roles.Student, Roles.Mentor, Roles.Admin],
            onClick: () => {},
        },
        {
            icon: ArrowRightFromSquare,
            text: 'Выход',
            visibleRoles: [Roles.Student, Roles.Mentor, Roles.Admin],
            onClick: () => {},
        },
    ]

    const filteredUpperSidebarData: AsideHeaderItem[] = upperSidebarData
        .filter((sidebarElement) => sidebarElement.visibleRoles.includes(role))
        .map((sidebarElement) => ({
            id: sidebarElement.text,
            title: sidebarElement.text,
            icon: sidebarElement.icon,
            onItemClick: sidebarElement.onClick,
        }))

    const filteredLowerSidebarData: AsideHeaderItem[] = lowerSidebarData
        .filter((sidebarElement) => sidebarElement.visibleRoles.includes(role))
        .map((sidebarElement) => ({
            id: sidebarElement.text,
            title: sidebarElement.text,
            icon: sidebarElement.icon,
            onItemClick: sidebarElement.onClick,
        }))

    return (
        <AsideHeader
            logo={{
                icon: GraduationCap,
                text: 'FRONTEND HW',
                onClick: () => {},
                iconSize: 24,
                className: 'asideHeaderLogo',
            }}
            compact={false}
            subheaderItems={filteredUpperSidebarData}
            menuItems={filteredLowerSidebarData}
            renderContent={() => mainContent}
        />
    )
}
