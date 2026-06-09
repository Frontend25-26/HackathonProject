'use client';

import { Card } from '@gravity-ui/uikit';

import styles from './ErrorComponent.module.css';

interface ErrorComponentProps {
    message: string;
}

export const ErrorComponent = ({ message }: ErrorComponentProps) => (
    <Card view="raised" className={styles.errorCard}>
        {message}
    </Card>
);
