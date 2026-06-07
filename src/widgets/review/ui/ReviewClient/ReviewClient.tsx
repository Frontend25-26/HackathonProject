'use client';

import { Button } from '@gravity-ui/uikit';
import { useCallback, useState } from 'react';

import { DisplayedSubmission } from '@/entities/submission';
import { Menu } from '@/shared/components/Menu';
import { formatDateFromISODate } from '@/shared/utils/helpers';
import { ReviewTable } from '@/widgets/review/ui/ReviewTable/ReviewTable';

import { filtersData } from '../../model/review';

import styles from './ReviewClient.module.css';

import type { Filter, FilterProperties } from '../../model/review';

function filterData(
    data: DisplayedSubmission[],
    filter: Filter,
): DisplayedSubmission[] {
    return data.filter((submission) => {
        return (
            (!filter.course || submission.course === filter.course) &&
            (!filter.deadline || submission.deadline === filter.deadline) &&
            (!filter.ciStatus || submission.ciStatus === filter.ciStatus)
        );
    });
}

const CLEAR_FILTER_OPTION = 'Очистить фильтр';
const CLEAR_ALL_FILTERS = 'Сбросить все фильтры';
export function ReviewClient({ data }: { data: DisplayedSubmission[] }) {
    const [filter, setFilter] = useState<Filter>({
        course: null,
        deadline: null,
        ciStatus: null,
    });

    const getTitle = useCallback((base: string, value: string | null) => {
        return value ? `${base}: ${value}` : base;
    }, []);

    const handleFilterChange = useCallback(
        (key: keyof Filter, value: string) => {
            setFilter((prev) => ({
                ...prev,
                [key]: value === CLEAR_FILTER_OPTION ? null : value,
            }));
        },
        [],
    );

    const resetFilters = useCallback(() => {
        setFilter({
            course: null,
            deadline: null,
            ciStatus: null,
        });
    }, []);

    const toMenuItem = useCallback(
        (properties: FilterProperties) => {
            const options = [
                ...new Set(
                    data.map((r) => {
                        if (properties.propertyName === 'deadline') {
                            return formatDateFromISODate(
                                r[properties.propertyName],
                            );
                        }
                        return r[properties.propertyName];
                    }),
                ),
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
        },
        [data, filter, getTitle, handleFilterChange],
    );

    return (
        <div>
            <div className={styles.filters}>
                <p>Фильтры поиска:</p>

                {filtersData.map(toMenuItem)}
            </div>

            <div className={styles.eraseFilters}>
                <Button view="outlined-utility" onClick={resetFilters}>
                    {CLEAR_ALL_FILTERS}
                </Button>
            </div>

            <ReviewTable tableData={filterData(data, filter)} />
        </div>
    );
}
