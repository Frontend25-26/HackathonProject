'use client'

import '@gravity-ui/uikit/styles/fonts.css'
import '@gravity-ui/uikit/styles/styles.css'

import { ThemeProvider } from '@gravity-ui/uikit'
import React, { JSX } from 'react'

import { Roles } from '@/shared/types/roles'

import { Header } from './Header'
import styles from './layout.module.css'
import { Sidebar } from './Sidebar'

export interface UserProps {
    name: string
    role: Roles
    image: JSX.Element
}

export function LayoutContent({
    children,
    user,
}: {
    children: React.ReactNode
    user: UserProps | null
}) {
    return (
        <ThemeProvider theme="light">
            <Sidebar
                user={user}
                mainContent={
                    <div>
                        <Header user={user} />
                        <main className={styles.mainContent}>{children}</main>
                    </div>
                }
            />
        </ThemeProvider>
    )
}
