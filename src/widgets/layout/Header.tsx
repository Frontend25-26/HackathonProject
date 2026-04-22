import { Bell, CircleQuestion } from '@gravity-ui/icons'
import { Label } from '@gravity-ui/uikit'
import { FC } from 'react'

import { Roles } from '@/shared/types/roles'

import styles from './layout.module.css'
import { UserProps } from './layoutContent'

interface RoleDisplay {
    displayRoleName: string
    theme:
        | 'normal'
        | 'info'
        | 'danger'
        | 'warning'
        | 'success'
        | 'utility'
        | 'unknown'
        | 'clear'
        | undefined
}

type RoleMatcher = Record<Roles, RoleDisplay>

const roleMatcher: RoleMatcher = {
    Student: {
        displayRoleName: 'Студент',
        theme: 'utility',
    },
    Mentor: {
        displayRoleName: 'Ментор',
        theme: 'info',
    },
    Admin: {
        displayRoleName: 'Администратор',
        theme: 'danger',
    },
    Unauthorised: {
        displayRoleName: 'Гость',
        theme: 'normal',
    },
}

const UserPanel: FC<{ user: UserProps }> = ({ user }) => {
    const roleStyles: RoleDisplay = roleMatcher[user.role]

    return (
        <div className={styles.userPanel}>
            <div className={styles.userPanelInfo}>
                <div className={styles.userPanelName}>{user.name}</div>
                <div className={styles.userPanelRole}>
                    <Label theme={roleStyles.theme}>
                        {roleStyles.displayRoleName}
                    </Label>
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
