import { FC } from 'react';

import { StudentCourses } from '@/entities/course';
import { apiFetch } from '@/shared/api';

import type { Course } from '@/entities/course/api/types';

const StudentCoursesPage: FC = async () => {
    const courses = await apiFetch<Course[]>('/api/courses');
    return <StudentCourses courses={courses} />;
};

export default StudentCoursesPage;
