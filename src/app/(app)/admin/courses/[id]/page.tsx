'use client';

import { Text } from '@gravity-ui/uikit';
import { useParams } from 'next/navigation';

import { useCourseAssignments } from '@/entities/assignment';
import { CourseAssignmentsWidget } from '@/widgets/courseAssignments';

export default function AdminCoursePage() {
    const params = useParams<{ id: string }>();

    const courseId: number = Number(params?.id);

    const { course, assignments, isLoadingAssignments, error, isNotFound } =
        useCourseAssignments(courseId);

    if (isNotFound) {
        return (
            <Text
                variant="header-1"
                style={{ marginBottom: '16px', display: 'block' }}
            >
                Курс не найден
            </Text>
        );
    }

    return (
        <>
            <CourseAssignmentsWidget
                course={course}
                assignments={assignments}
                isLoading={isLoadingAssignments}
                error={error}
            />
        </>
    );
}
