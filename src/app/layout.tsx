import './globals.css';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import { ReactNode } from 'react';

import { ClientLayout } from '@/widgets/layout/';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html>
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
