'use client'

import '@gravity-ui/uikit/styles/fonts.css'
import '@gravity-ui/uikit/styles/styles.css'

import { ThemeProvider } from '@gravity-ui/uikit'
import React from 'react'

import { UserProps } from '../../layout'

import { Header } from './Header'
import styles from './layout.module.css'
import { Sidebar } from './Sidebar'

export function LayoutContent({
    children,
    user,
}: {
    children: React.ReactNode
    user: UserProps | null
}) {
    return (
        <ThemeProvider theme="light">
            <Header user={user} />
            <Sidebar user={user} />
            <main className={styles.mainContent}>{children}</main>
        </ThemeProvider>
    )
}
