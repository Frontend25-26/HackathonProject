'use client';

import { Button } from '@gravity-ui/uikit';
import { useState } from 'react';

import { Submission } from '@/entities/submission';
import { MenuItem } from '@/shared/components/Menu';
import { ReviewTable } from '@/widgets/review/ui/ReviewTable';

import { filtersData } from '../model/review';

import ReviewTableStyles from './ReviewTableStyles.module.css';

import type { Filter, FilterProperties } from '../model/review';

function filterData(data: Submission[], filter: Filter): Submission[] {
    return data.filter((assignment) => {
        return (
            (!filter.Course || assignment.Course === filter.Course) &&
            (!filter.Deadline || assignment.Deadline === filter.Deadline) &&
            (!filter.CIStatus || assignment.CIStatus === filter.CIStatus)
        );
    });
}

export function ReviewClient({ data }: { data: Submission[] }) {
    const [filter, setFilter] = useState<Filter>({
        Course: null,
        Deadline: null,
        CIStatus: null,
    });

    const getTitle = (base: string, value: string | null) => {
        return value ? `${base}: ${value}` : base;
    };

    const handleFilterChange = (key: keyof Filter, value: string) => {
        setFilter((prev) => ({
            ...prev,
            [key]: value === 'Очистить фильтр' ? null : value,
        }));
    };

    const resetFilters = () => {
        setFilter({
            Course: null,
            Deadline: null,
            CIStatus: null,
        });
    };

    const toMenuItem = (properties: FilterProperties) => {
        const options = [
            ...new Set(data.map((r) => r[properties.propertyName])),
            'Очистить фильтр',
        ];

        const currentValue = filter[properties.filterName];

        return (
            <MenuItem
                key={properties.title}
                elements={options}
                title={getTitle(properties.title, currentValue)}
                onSelect={(value) =>
                    handleFilterChange(properties.filterName, value)
                }
            />
        );
    };

    return (
        <div>
            <div className={ReviewTableStyles.filters}>
                <p>Фильтры поиска:</p>

                {filtersData.map(toMenuItem)}
            </div>

            <div className={ReviewTableStyles.eraseFilters}>
                <Button view="outlined-utility" onClick={resetFilters}>
                    Сбросить все фильтры
                </Button>
            </div>

            <ReviewTable tableData={filterData(data, filter)} />
        </div>
    );
}
