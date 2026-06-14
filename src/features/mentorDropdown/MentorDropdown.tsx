'use client';

import { Pencil } from '@gravity-ui/icons';
import {
    Button,
    DropdownMenu,
    Icon,
    type DropdownMenuItem,
} from '@gravity-ui/uikit';
import { FC, useMemo } from 'react';

import type { User } from '@/shared/types/user';

interface MentorDropdownProps {
    readonly currentMentorId: number | null;
    readonly mentors: readonly User[];
    readonly onSelect: (mentorId: number | null) => void;
}

export const MentorDropdown: FC<MentorDropdownProps> = ({
    currentMentorId,
    mentors,
    onSelect,
}) => {
    const items: DropdownMenuItem[] = useMemo((): DropdownMenuItem[] => {
        const isUnassigned = currentMentorId === null;

        const unassigned: DropdownMenuItem = {
            text: isUnassigned ? '-> Не назначен' : 'Не назначен',
            action: (): void => onSelect(null),
        };

        const mentorItems: DropdownMenuItem[] = mentors.map(
            (m: User): DropdownMenuItem => ({
                text:
                    currentMentorId === m.id
                        ? `-> ${m.name}`
                        : m.name || m.login,
                action: (): void => onSelect(m.id),
            }),
        );

        return [unassigned, ...mentorItems];
    }, [mentors, currentMentorId, onSelect]);

    return (
        <DropdownMenu
            items={items}
            renderSwitcher={(props) => (
                <Button view="flat" size="s" disabled={false} {...props}>
                    <Icon data={Pencil} size={16} />
                </Button>
            )}
        />
    );
};
