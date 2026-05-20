import { FC } from 'react';

import { StudentCourses } from '@/entities/course';
import { apiFetch } from '@/shared/api';

interface CourseFromAPI {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const StudentCoursesPage: FC = async () => {
    const courses = await apiFetch<CourseFromAPI[]>('/api/courses');
    return <StudentCourses courses={courses} />;
};

export default StudentCoursesPage;
