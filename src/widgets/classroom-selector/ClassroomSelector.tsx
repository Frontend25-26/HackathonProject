'use client';

import { Button, Card, Label, Text } from '@gravity-ui/uikit';
import Image from 'next/image';
import { useState } from 'react';

import { apiFetch } from '@/shared/api';

import styles from './ClassroomSelector.module.css';

import type { GhClassroom } from '@backend/github/classroom';
import type { FC } from 'react';

interface ClassroomSelectorProps {
    classrooms: GhClassroom[];
    selectedClassroomId: number | null;
}

export const ClassroomSelector: FC<ClassroomSelectorProps> = ({
    classrooms,
    selectedClassroomId: initial,
}) => {
    const [selectedId, setSelectedId] = useState<number | null>(initial);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleSelect = async (id: number): Promise<void> => {
        if (id === selectedId) return;
        setLoadingId(id);
        try {
            await apiFetch('/api/settings', {
                method: 'PATCH',
                body: { classroomId: id },
            });
            setSelectedId(id);
        } finally {
            setLoadingId(null);
        }
    };

    if (classrooms.length === 0) {
        return (
            <Text color="secondary">
                Классрумы не найдены. Проверь GitHub токен и права в
                организации.
            </Text>
        );
    }

    return (
        <div className={styles.grid}>
            {classrooms.map((classroom) => {
                const isSelected = classroom.id === selectedId;
                const isLoading = classroom.id === loadingId;

                return (
                    <Card
                        key={classroom.id}
                        className={styles.card}
                        selected={isSelected}
                        onClick={() => handleSelect(classroom.id)}
                    >
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                                {classroom.organization?.avatar_url && (
                                    <Image
                                        src={classroom.organization.avatar_url}
                                        alt={classroom.organization.login}
                                        className={styles.avatar}
                                    />
                                )}
                                <div className={styles.cardInfo}>
                                    <Text variant="subheader-2">
                                        {classroom.name}
                                    </Text>
                                    <Text color="secondary" variant="body-1">
                                        {classroom.organization?.login}
                                    </Text>
                                </div>
                                {isSelected && (
                                    <Label theme="success" size="m">
                                        Выбран
                                    </Label>
                                )}
                                {classroom.archived && (
                                    <Label theme="warning" size="m">
                                        Архив
                                    </Label>
                                )}
                            </div>
                            <Button
                                view={isSelected ? 'flat-success' : 'outlined'}
                                size="m"
                                loading={isLoading}
                                disabled={isSelected}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(classroom.id);
                                }}
                                width="max"
                            >
                                {isSelected ? 'Активный' : 'Выбрать'}
                            </Button>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
