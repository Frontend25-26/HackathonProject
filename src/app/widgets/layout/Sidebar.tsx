import {
    ArrowRightFromSquare,
    CircleQuestion,
    Dots9,
    Gear,
    GraduationCap,
    ListUl,
    Persons,
} from '@gravity-ui/icons'
import { FC, JSX } from 'react'

import { Roles } from '@/app/shared/types/roles'
import styles from '@/app/widgets/layout/layout.module.css'

import { UserProps } from '../../layout'

interface SidebarElement {
    image: JSX.Element
    text: string
    hideRoles: Roles[]
}

const ImageWithText: React.FC<{ image: JSX.Element; text: string }> = ({
    image,
    text,
}) => {
    return (
        <div className={styles.sidebarElement}>
            {image}
            <p>{text}</p>
        </div>
    )
}

export const Sidebar: FC<{ user: UserProps | null }> = ({ user }) => {
    if (!user) {
        return <div></div>
    }
    const role = user.role

    const upperSidebarData: SidebarElement[] = [
        { image: <Dots9 />, text: 'Панель', hideRoles: [] },
        { image: <ListUl />, text: 'Задания', hideRoles: [] },
        {
            image: <GraduationCap />,
            text: 'Менторы',
            hideRoles: [Roles.Student, Roles.Mentor],
        },
        {
            image: <Persons />,
            text: 'Студенты',
            hideRoles: [Roles.Student, Roles.Mentor],
        },
        { image: <Gear />, text: 'Настройки', hideRoles: [] },
    ]

    const lowerSidebarData: SidebarElement[] = [
        { image: <CircleQuestion />, text: 'FAQ', hideRoles: [] },
        { image: <ArrowRightFromSquare />, text: 'Выход', hideRoles: [] },
    ]

    const filteredUpperSidebarData = upperSidebarData.filter(
        (sidebarElement) => !sidebarElement.hideRoles.includes(role),
    )

    const filteredLowerSidebarData = lowerSidebarData.filter(
        (sidebarElement) => !sidebarElement.hideRoles.includes(role),
    )

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div className={styles.sidebarHeaderTitle}>FRONTEND HW</div>
                <div className={styles.sidebarHeaderSubtitle}>
                    Course Workspace
                </div>
            </div>

            <nav className={styles.sidebarNav}>
                {filteredUpperSidebarData.map((sidebarElement) => (
                    <div key={sidebarElement.text}>
                        <ImageWithText
                            image={sidebarElement.image}
                            text={sidebarElement.text}
                        />
                    </div>
                ))}
            </nav>

            <nav className={styles.sidebarNavBottom}>
                {filteredLowerSidebarData.map((sidebarElement) => (
                    <div key={sidebarElement.text}>
                        <ImageWithText
                            image={sidebarElement.image}
                            text={sidebarElement.text}
                        />
                    </div>
                ))}
            </nav>
        </aside>
    )
}
