'use client';
import { DropdownMenu } from '@gravity-ui/uikit';

import type { FC } from 'react';

interface MenuProps {
    elements: string[];
    title: string;
    onSelect: (value: string) => void;
}

export const Menu: FC<MenuProps> = ({ elements, title, onSelect }) => (
    <DropdownMenu
        size="m"
        icon={title}
        items={elements.map((element) => {
            return {
                text: element,
                action: () => onSelect(element),
            };
        })}
    />
);
