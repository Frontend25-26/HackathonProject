import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { auth } from '@/features/auth/authSetup';
import { LayoutContent } from '@/widgets/layout';
import { userRepository } from '@backend/users/repository';

export default async function AppLayout({ children }: { children: ReactNode }) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    const user = await userRepository.findById(session.user.userId);

    if (!user) {
        redirect('/login');
    }

    return <LayoutContent user={user}>{children}</LayoutContent>;
}
