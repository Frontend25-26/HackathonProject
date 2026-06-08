'use client';

import { useParams } from 'next/navigation';

import { CourseCard } from '@/widgets/adminCourseCard';

export default function AdminCoursePage() {
    const params = useParams<{ id: string }>();

    const courseId: number = Number(params?.id);

    return <CourseCard courseId={courseId} />;
}
