'use client';

import 'swagger-ui-react/swagger-ui.css';

import { ThemeProvider } from '@gravity-ui/uikit';
import SwaggerUI from 'swagger-ui-react';

import styles from './page.module.css';

export default function DocsPage() {
    return (
        <ThemeProvider theme="light">
            <div className={styles.container}>
                <SwaggerUI url="/api/docs" />
            </div>
        </ThemeProvider>
    );
}
