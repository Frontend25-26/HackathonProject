'use client';
import { LogoGithub } from '@gravity-ui/icons';
import { Button, Card, Text } from '@gravity-ui/uikit';
import { FC } from 'react';

import { loginWithGithub } from '@/features/loginAction/action';

import styles from './LoginBox.module.css';

export const LoginBox: FC = () => {
    return (
        <div className={styles['login-box']}>
            <Card
                type="container"
                view="raised"
                size="m"
                className={styles['login-box__card']}
            >
                <Text variant="header-2">Frontend HW</Text>
                <Text variant="subheader-2">
                    Платформа проверки домашних заданий
                </Text>

                <Button
                    size="l"
                    width="max"
                    onClick={loginWithGithub}
                    className={styles['login-box__button']}
                >
                    <span className={styles['login-box__button-text']}>
                        <LogoGithub height={20} />
                        <Text variant="subheader-2">Войти через GitHub</Text>
                    </span>
                </Button>
            </Card>
        </div>
    );
};
