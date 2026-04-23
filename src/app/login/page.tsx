"use client"
import { LogoGithub } from "@gravity-ui/icons"
import { Button, Card, Text, ThemeProvider } from "@gravity-ui/uikit"
import React from "react"

import { loginWithGithub } from "./action"
import './style.css'

const LoginPage: React.FC = () => {

    return (
        <ThemeProvider theme="light">
            <div className="box">
                <Card type="container" view="raised" className="login-card">
                    <Text variant="header-2">Frontend HW</Text>
                    <Text variant="subheader-2">Платформа проверки домашних заданий</Text>

                        <Button size="l" width="max" onClick={loginWithGithub} className="login-button">
                        <LogoGithub className="github-logo"></LogoGithub>
                        <Text variant="subheader-2">Войти через GitHub</Text>
                        </Button>
                    <hr/>
                </Card>
            </div>
        </ThemeProvider>
)
}

export default LoginPage