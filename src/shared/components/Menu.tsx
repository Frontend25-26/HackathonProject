'use client';
import { DropdownMenu } from '@gravity-ui/uikit';
import { FC } from 'react';

interface MenuProps {
    elements: string[];
    title: string;
    onSelect: (value: string) => void;
}

export const MenuItem: FC<MenuProps> = ({ elements, title, onSelect }) => {
    return (
        <DropdownMenu
            size="m"
            icon={<div>{title}</div>}
            items={elements.map((element) => {
                return {
                    text: element,
                    action: () => onSelect(element),
                };
            })}
        />
    );
};
