'use client';

import { Button } from '@gravity-ui/uikit';
import { useState } from 'react';

import { Submission } from '@/entities/submission';
import { Menu } from '@/shared/components/Menu';
import { ReviewTable } from '@/widgets/review/ui/ReviewTable';

import { filtersData } from '../model/review';

import styles from './ReviewClient.module.css';

import type { Filter, FilterProperties } from '../model/review';

function filterData(data: Submission[], filter: Filter): Submission[] {
    return data.filter((assignment) => {
        return (
            (!filter.course || assignment.Course === filter.course) &&
            (!filter.deadline || assignment.Deadline === filter.deadline) &&
            (!filter.ciStatus || assignment.CIStatus === filter.ciStatus)
        );
    });
}

const CLEAR_FILTER_OPTION = 'Очистить фильтр';
export function ReviewClient({ data }: { data: Submission[] }) {
    const [filter, setFilter] = useState<Filter>({
        course: null,
        deadline: null,
        ciStatus: null,
    });

    const getTitle = (base: string, value: string | null) => {
        return value ? `${base}: ${value}` : base;
    };

    const handleFilterChange = (key: keyof Filter, value: string) => {
        setFilter((prev) => ({
            ...prev,
            [key]: value === CLEAR_FILTER_OPTION ? null : value,
        }));
    };

    const resetFilters = () => {
        setFilter({
            course: null,
            deadline: null,
            ciStatus: null,
        });
    };

    const toMenuItem = (properties: FilterProperties) => {
        const options = [
            ...new Set(data.map((r) => r[properties.propertyName])),
            CLEAR_FILTER_OPTION,
        ];

        const currentValue = filter[properties.filterName];

        return (
            <Menu
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
            <div className={styles.filters}>
                <p>Фильтры поиска:</p>

                {filtersData.map(toMenuItem)}
            </div>

            <div className={styles.eraseFilters}>
                <Button view="outlined-utility" onClick={resetFilters}>
                    Сбросить все фильтры
                </Button>
            </div>

            <ReviewTable tableData={filterData(data, filter)} />
        </div>
    );
}
