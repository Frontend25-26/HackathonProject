'use client';

import { Pencil } from '@gravity-ui/icons';
import {
    DropdownMenu,
    Button,
    type DropdownMenuItem,
    Icon,
} from '@gravity-ui/uikit';
import { FC, useMemo } from 'react';

import { UserRole } from '@/shared/types/user';

interface UserRoleDropdownProps {
    readonly currentRole: UserRole;
    readonly isDisabled: boolean;
    readonly onSelect: (role: UserRole) => void;
}

const ROLES: { value: UserRole; label: string }[] = [
    { value: 'STUDENT', label: 'Студент' },
    { value: 'MENTOR', label: 'Ментор' },
    { value: 'ADMIN', label: 'Администратор' },
];

export const UserRoleDropdown: FC<UserRoleDropdownProps> = ({
    currentRole,
    isDisabled,
    onSelect,
}) => {
    const items: DropdownMenuItem[] = useMemo(
        () =>
            ROLES.map((r) => ({
                text: r.value === currentRole ? `-> ${r.label}` : r.label,
                action: () => onSelect(r.value),
            })),
        [currentRole, onSelect],
    );

    const currentLabel =
        ROLES.find((r) => r.value === currentRole)?.label || 'Роль';

    return (
        <DropdownMenu
            items={items}
            renderSwitcher={(props) => (
                <Button view="flat" size="s" disabled={isDisabled} {...props}>
                    {currentLabel}
                    <Icon data={Pencil} size={16} />
                </Button>
            )}
        />
    );
};
