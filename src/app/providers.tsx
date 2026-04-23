"use client"

import { ThemeProvider } from "@gravity-ui/uikit"

export default function Providers({ children, }: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider theme="light">
            {children}
        </ThemeProvider>
    )
}