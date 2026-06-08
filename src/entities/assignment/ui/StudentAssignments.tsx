'use client';

import { Text, Box, Select, Button, Label, Flex } from '@gravity-ui/uikit';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';

import { AssignmentStatus, type Assignment } from '@/shared/types/assignment';
import { Table } from '@/shared/ui/Table/Table';
import { formatDueDate } from '@/shared/utils/helpers';

import styles from './StudentAssignments.module.css';

import type { Course } from '@/entities/course';
import type { Submission } from '@/shared/types/submission';

interface StudentAssignmentsProps {
    assignments: Assignment[];
    courses: Course[];
    submissions?: Submission[];
    initialCourseId?: number;
}

interface EnrichedAssignment extends Assignment {
    courseTitle: string;
    status: AssignmentStatus;
    score: number;
}

const STATUS_CONFIG = {
    [AssignmentStatus.ACTIVE]: { text: 'Активное', theme: 'info' as const },
    [AssignmentStatus.OVERDUE]: {
        text: 'Просрочено',
        theme: 'danger' as const,
    },
    [AssignmentStatus.COMPLETED]: { text: 'Сдано', theme: 'success' as const },
};

const COMPLETED_STATUSES = ['APPROVED', 'COMPLETED'];

const getAssignmentStatusWithSubmission = (
    assignment: Assignment,
    submission?: Submission,
): AssignmentStatus => {
    if (submission && COMPLETED_STATUSES.includes(submission.status)) {
        return AssignmentStatus.COMPLETED;
    }
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    return dueDate < now ? AssignmentStatus.OVERDUE : AssignmentStatus.ACTIVE;
};

const columns = [
    {
        id: 'title',
        name: 'Название',
        template: (item: EnrichedAssignment) => item.title,
    },
    {
        id: 'courseTitle',
        name: 'Курс',
        template: (item: EnrichedAssignment) => item.courseTitle,
    },
    {
        id: 'dueDate',
        name: 'Дедлайн',
        template: (item: EnrichedAssignment) => formatDueDate(item.dueDate),
    },
    {
        id: 'maxGrade',
        name: 'Баллы',
        template: (item: EnrichedAssignment) =>
            `${item.score} / ${item.maxGrade}`,
    },
    {
        id: 'status',
        name: 'Статус',
        template: (item: EnrichedAssignment) => {
            const config = STATUS_CONFIG[item.status];
            if (!config) return <Label theme="unknown">—</Label>;
            return <Label theme={config.theme}>{config.text}</Label>;
        },
    },
];

export const StudentAssignments = ({
    assignments,
    courses,
    submissions = [],
    initialCourseId,
}: StudentAssignmentsProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedCourse, setSelectedCourse] = useState<string>(
        initialCourseId ? String(initialCourseId) : 'all',
    );
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const coursesMap = useMemo(
        () => new Map(courses.map((course) => [course.id, course.title])),
        [courses],
    );

    const submissionsMap = useMemo(
        () =>
            new Map(submissions.map((sub) => [Number(sub.assignmentId), sub])),
        [submissions],
    );

    const enrichedAssignments: EnrichedAssignment[] = useMemo(
        () =>
            assignments.map((assignment) => {
                const submission = submissionsMap.get(assignment.id);
                return {
                    ...assignment,
                    courseTitle:
                        coursesMap.get(assignment.courseId) ||
                        `Курс ${assignment.courseId}`,
                    status: getAssignmentStatusWithSubmission(
                        assignment,
                        submission,
                    ),
                    score: submission?.score ?? 0,
                };
            }),
        [assignments, coursesMap, submissionsMap],
    );

    const filteredAssignments = useMemo(() => {
        let filtered = enrichedAssignments;
        if (selectedCourse !== 'all') {
            filtered = filtered.filter(
                (a) => a.courseId === Number(selectedCourse),
            );
        }
        if (selectedStatus !== 'all') {
            filtered = filtered.filter((a) => a.status === selectedStatus);
        }
        return filtered;
    }, [enrichedAssignments, selectedCourse, selectedStatus]);

    const handleReset = () => {
        setSelectedCourse('all');
        setSelectedStatus('all');
        router.push(pathname);
    };

    const courseOptions = useMemo(
        () => [
            { value: 'all', content: 'Все курсы' },
            ...courses.map((course) => ({
                value: String(course.id),
                content: course.title,
            })),
        ],
        [courses],
    );

    const statusOptions = [
        { value: 'all', content: 'Все статусы' },
        { value: AssignmentStatus.ACTIVE, content: 'Активные' },
        { value: AssignmentStatus.OVERDUE, content: 'Просроченные' },
        { value: AssignmentStatus.COMPLETED, content: 'Сданные' },
    ];

    return (
        <Flex direction="column">
            <Text as="h1" variant="display-1">
                Мои домашние задания
            </Text>
            <Flex wrap="wrap" gap={4} alignItems="flex-end">
                <Box>
                    <Select
                        value={[selectedCourse]}
                        onUpdate={([value]) => setSelectedCourse(value)}
                        options={courseOptions}
                    />
                </Box>
                <Box>
                    <Select
                        value={[selectedStatus]}
                        onUpdate={([value]) => setSelectedStatus(value)}
                        options={statusOptions}
                    />
                </Box>
                <Button
                    onClick={handleReset}
                    disabled={
                        selectedCourse === 'all' && selectedStatus === 'all'
                    }
                >
                    Сбросить
                </Button>
            </Flex>

            <Box className={styles.tableWrapper}>
                <Table
                    data={filteredAssignments}
                    columns={columns}
                    verticalAlign="middle"
                    onRowClick={(item: EnrichedAssignment) =>
                        router.push(`/student/assignments/${item.id}`)
                    }
                    emptyMessage="Нет домашних заданий"
                />
            </Box>
        </Flex>
    );
};
