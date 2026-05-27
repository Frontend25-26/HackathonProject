import { prisma } from '@backend/lib/prisma';
import { Course, SubmissionStatus } from '@backend/generated/prisma';

type CourseWithStats = Omit<Course, never> & {
    assignmentsTotal: number;
    assignmentsCompleted: number;
    totalScore: number;
    maxScore: number;
};

class CourseRepository {
    async findAll(): Promise<Course[]> {
        return prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async findAllWithStats(studentId: number): Promise<CourseWithStats[]> {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                assignments: {
                    select: {
                        maxGrade: true,
                        submissions: {
                            where: { studentId },
                            select: {
                                status: true,
                                review: { select: { grade: true } },
                            },
                        },
                    },
                },
            },
        });

        return courses.map(({ assignments, ...course }) => {
            let assignmentsCompleted = 0;
            let totalScore = 0;
            let maxScore = 0;

            for (const assignment of assignments) {
                maxScore += assignment.maxGrade;
                const submission = assignment.submissions[0];
                if (submission?.status === SubmissionStatus.APPROVED) {
                    assignmentsCompleted++;
                    if (submission.review) {
                        totalScore += submission.review.grade;
                    }
                }
            }

            return {
                ...course,
                assignmentsTotal: assignments.length,
                assignmentsCompleted,
                totalScore,
                maxScore,
            };
        });
    }

    async findById(id: number): Promise<Course | null> {
        return prisma.course.findUnique({ where: { id } });
    }

    async create(data: { title: string }): Promise<Course> {
        return prisma.course.create({
            data: { ...data, createdAt: new Date(), updatedAt: new Date() },
        });
    }

    async update(
        id: number,
        data: { title?: string; description?: string },
    ): Promise<Course> {
        return prisma.course.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Course> {
        return prisma.course.delete({ where: { id } });
    }
}

export const courseRepository = new CourseRepository();
