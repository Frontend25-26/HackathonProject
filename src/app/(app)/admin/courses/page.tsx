import { fetchCourses } from '@/entities/adminCourses/api';
import { AdminCoursesWidget } from '@/widgets/adminCourses';

export default async function AdminCoursesPage() {
    const courses = await fetchCourses();
    return <AdminCoursesWidget courses={courses} />;
}
