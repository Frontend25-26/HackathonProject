import { Bell, CircleQuestion } from '@gravity-ui/icons'
import { FC } from 'react'

import { Roles } from '@/app/shared/types/roles'
import styles from '@/app/widgets/layout/layout.module.css'

import { UserProps } from '../../layout'

interface RoleDisplay {
    displayRoleName: string
    backgroundColor: string
    color: string
}

type RoleMatcher = Record<Roles, RoleDisplay>

const roleMatcher: RoleMatcher = {
    Student: {
        displayRoleName: 'Студент',
        backgroundColor: '#D4A0FF',
        color: '#4F1C7B',
    },
    Mentor: {
        displayRoleName: 'Ментор',
        backgroundColor: '#34B5FA33',
        color: '#34B5FA',
    },
    Admin: {
        displayRoleName: 'Администратор',
        backgroundColor: '#FF9E9E',
        color: '#D50000',
    },
    Unauthorised: {
        displayRoleName: 'Гость',
        backgroundColor: '#f5f5f5',
        color: '#000000',
    },
}

const UserPanel: FC<{ user: UserProps }> = ({ user }) => {
    const roleStyles: RoleDisplay = roleMatcher[user.role]

    return (
        <div className={styles.userPanel}>
            <div className={styles.userPanelInfo}>
                <div className={styles.userPanelName}>{user.name}</div>
                <div>
                    <div
                        className={styles.userPanelRole}
                        style={{
                            backgroundColor: roleStyles.backgroundColor,
                            color: roleStyles.color,
                        }}
                    >
                        {roleStyles.displayRoleName}
                    </div>
                </div>
            </div>

            {user.image}
        </div>
    )
}

export const Header: FC<{ user: UserProps | null }> = ({ user }) => {
    if (!user) {
        return <div></div>
    }
    return (
        <header className={styles.header}>
            <div className={styles.headerRight}>
                <div className={styles.headerIcons}>
                    <Bell className={styles.headerIcon} />
                    <CircleQuestion className={styles.headerIcon} />
                </div>

                <div className={styles.userPanelWrapper}>
                    <UserPanel user={user} />
                </div>
            </div>
        </header>
    )
}
