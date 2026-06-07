import {
    ArrowRightFromSquare,
    Bell,
    GraduationCap,
    Moon,
    Sun,
} from '@gravity-ui/icons';
import { AsideHeader, FooterItem } from '@gravity-ui/navigation';
import { signOut } from 'next-auth/react';
import { FC, PropsWithChildren, useState } from 'react';

import { Theme, useTheme } from '@/features/theme';

import { MenuItemConfig, primaryMenu, secondaryMenu } from '../model/menu';

import { NotificationFooterItem } from './notification/NotificationFooterItem';
import { UserFooterItem } from './user/UserFooterItem';

import type { Role, User } from '@/entities/user';

const toAsideItems = (items: MenuItemConfig[], role: Role): MenuItemConfig[] =>
    items.filter((item) => item.visibleRoles.includes(role));

interface SidebarProps extends PropsWithChildren {
    user: User | null;
    onToggleTheme: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
    user,
    onToggleTheme,
    children,
}) => {
    const [compact, setCompact] = useState(false);
    const theme = useTheme((state) => state.theme);
    const isDark = theme === Theme.DARK;

    if (!user) {
        return children;
    }

    return (
        <AsideHeader
            logo={{
                icon: GraduationCap,
                text: 'ITMOxFrontEnd',
                iconSize: 24,
            }}
            compact={compact}
            onChangeCompact={setCompact}
            subheaderItems={toAsideItems(primaryMenu, user.role)}
            menuItems={toAsideItems(secondaryMenu, user.role)}
            renderContent={() => children}
            renderFooter={({ compact }) => (
                <>
                    <NotificationFooterItem compact={compact} />
                    <FooterItem
                        compact={compact}
                        id="theme"
                        title={isDark ? 'Светлая тема' : 'Тёмная тема'}
                        icon={isDark ? Sun : Moon}
                        onItemClick={onToggleTheme}
                    />
                    <UserFooterItem user={user} compact={compact} />
                    <FooterItem
                        compact={compact}
                        id="logout"
                        icon={ArrowRightFromSquare}
                        onItemClick={() => signOut({ callbackUrl: '/' })}
                        title="Выйти"
                    />
                </>
            )}
        />
    );
};
