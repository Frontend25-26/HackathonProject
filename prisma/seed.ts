import 'dotenv/config';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import {
    CiStatus,
    PrismaClient,
    Role,
    SubmissionStatus,
} from '../src/backend/generated/prisma/client.js';

const adapter = new PrismaMariaDb({
    host: process.env['MYSQL_HOST'],
    user: process.env['MYSQL_USER'],
    database: process.env['MYSQL_DATABASE'],
    password: process.env['MYSQL_PASSWORD'],
    port: process.env['MYSQL_PORT']
        ? parseInt(process.env['MYSQL_PORT'])
        : undefined,
    allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({ adapter });

async function clearDatabase() {
    await prisma.reviewComment.deleteMany();
    await prisma.reviewThread.deleteMany();
    await prisma.review.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
}

async function seed() {
    console.log('🧹 Очистка базы данных...');
    await clearDatabase();

    console.log('👥 Создание пользователей...');

    await prisma.user.create({
        data: {
            githubId: 1000001,
            login: 'admin-octocat',
            name: 'Админ Платформы',
            email: 'admin@hackathon.local',
            avatar: 'https://avatars.githubusercontent.com/u/1000001?v=4',
            role: Role.ADMIN,
        },
    });

    const mentorAlice = await prisma.user.create({
        data: {
            githubId: 1000002,
            login: 'alice-mentor',
            name: 'Алиса Менторова',
            email: 'alice@hackathon.local',
            avatar: 'https://avatars.githubusercontent.com/u/1000002?v=4',
            role: Role.MENTOR,
        },
    });

    const mentorBob = await prisma.user.create({
        data: {
            githubId: 1000003,
            login: 'bob-mentor',
            name: 'Боб Ревьюверов',
            email: 'bob@hackathon.local',
            avatar: 'https://avatars.githubusercontent.com/u/1000003?v=4',
            role: Role.MENTOR,
        },
    });

    const studentIvan = await prisma.user.create({
        data: {
            githubId: 1000010,
            login: 'ivan-student',
            name: 'Иван Иванов',
            email: 'ivan@students.local',
            avatar: 'https://avatars.githubusercontent.com/u/1000010?v=4',
            role: Role.STUDENT,
        },
    });

    const studentMaria = await prisma.user.create({
        data: {
            githubId: 1000011,
            login: 'maria-student',
            name: 'Мария Петрова',
            email: 'maria@students.local',
            avatar: 'https://avatars.githubusercontent.com/u/1000011?v=4',
            role: Role.STUDENT,
        },
    });

    const studentPetr = await prisma.user.create({
        data: {
            githubId: 1000012,
            login: 'petr-student',
            name: 'Пётр Сидоров',
            email: 'petr@students.local',
            avatar: 'https://avatars.githubusercontent.com/u/1000012?v=4',
            role: Role.STUDENT,
        },
    });

    const studentAnna = await prisma.user.create({
        data: {
            githubId: 1000013,
            login: 'anna-student',
            name: 'Анна Кузнецова',
            email: 'anna@students.local',
            avatar: 'https://avatars.githubusercontent.com/u/1000013?v=4',
            role: Role.STUDENT,
        },
    });

    console.log('📚 Создание курсов...');

    const frontendCourse = await prisma.course.create({
        data: {
            title: 'Frontend разработка 2025/26',
        },
    });

    const algoCourse = await prisma.course.create({
        data: {
            title: 'Алгоритмы и структуры данных',
        },
    });

    console.log('🎓 Создание enrollments...');

    await prisma.enrollment.createMany({
        data: [
            {
                courseId: frontendCourse.id,
                studentId: studentIvan.id,
                mentorId: mentorAlice.id,
            },
            {
                courseId: frontendCourse.id,
                studentId: studentMaria.id,
                mentorId: mentorAlice.id,
            },
            {
                courseId: frontendCourse.id,
                studentId: studentPetr.id,
                mentorId: mentorBob.id,
            },
            {
                courseId: frontendCourse.id,
                studentId: studentAnna.id,
                mentorId: null,
            },
            {
                courseId: algoCourse.id,
                studentId: studentIvan.id,
                mentorId: mentorBob.id,
            },
            {
                courseId: algoCourse.id,
                studentId: studentPetr.id,
                mentorId: mentorBob.id,
            },
        ],
    });

    console.log('📝 Создание заданий...');

    const todoAssignment = await prisma.assignment.create({
        data: {
            title: 'TODO List на React',
            description:
                '## Задание\n\nРеализуйте TODO-приложение на React + TypeScript.\n\n### Требования\n- Добавление, удаление, редактирование задач\n- Фильтр по статусу (все/активные/выполненные)\n- Сохранение состояния в localStorage\n- Покрытие тестами не ниже 70%',
            classroomUrl:
                'https://classroom.github.com/a/example-todo-assignment',
            maxGrade: 100,
            dueDate: new Date('2026-05-15T23:59:00Z'),
            courseId: frontendCourse.id,
            createdById: mentorAlice.id,
        },
    });

    const formsAssignment = await prisma.assignment.create({
        data: {
            title: 'Формы и валидация',
            description:
                '## Задание\n\nРеализуйте многошаговую форму регистрации с валидацией через `react-hook-form` и `zod`.',
            classroomUrl:
                'https://classroom.github.com/a/example-forms-assignment',
            maxGrade: 100,
            dueDate: new Date('2026-05-29T23:59:00Z'),
            courseId: frontendCourse.id,
            createdById: mentorAlice.id,
        },
    });

    const sortAssignment = await prisma.assignment.create({
        data: {
            title: 'Сортировки за O(n log n)',
            description:
                '## Задание\n\nРеализуйте merge sort и quick sort. Сравните производительность на разных размерах входных данных.',
            classroomUrl:
                'https://classroom.github.com/a/example-sort-assignment',
            maxGrade: 100,
            dueDate: new Date('2026-05-10T23:59:00Z'),
            courseId: algoCourse.id,
            createdById: mentorBob.id,
        },
    });

    console.log('📤 Создание submissions...');

    const ivanTodoSubmission = await prisma.submission.create({
        data: {
            repoUrl: 'https://github.com/Frontend25-26/todo-ivan-student',
            assignmentId: todoAssignment.id,
            studentId: studentIvan.id,
            status: SubmissionStatus.IN_REVIEW,
            ciStatus: CiStatus.SUCCESS,
        },
    });

    const mariaTodoSubmission = await prisma.submission.create({
        data: {
            repoUrl: 'https://github.com/Frontend25-26/todo-maria-student',
            assignmentId: todoAssignment.id,
            studentId: studentMaria.id,
            status: SubmissionStatus.APPROVED,
            ciStatus: CiStatus.SUCCESS,
        },
    });

    await prisma.submission.create({
        data: {
            repoUrl: 'https://github.com/Frontend25-26/todo-petr-student',
            assignmentId: todoAssignment.id,
            studentId: studentPetr.id,
            status: SubmissionStatus.PENDING,
            ciStatus: CiStatus.RUNNING,
        },
    });

    await prisma.submission.create({
        data: {
            repoUrl: 'https://github.com/Frontend25-26/forms-ivan-student',
            assignmentId: formsAssignment.id,
            studentId: studentIvan.id,
            status: SubmissionStatus.DRAFT,
            ciStatus: CiStatus.UNKNOWN,
        },
    });

    const petrSortSubmission = await prisma.submission.create({
        data: {
            repoUrl: 'https://github.com/Frontend25-26/sort-petr-student',
            assignmentId: sortAssignment.id,
            studentId: studentPetr.id,
            status: SubmissionStatus.CHANGES_REQUESTED,
            ciStatus: CiStatus.FAILURE,
        },
    });

    console.log('🔍 Создание review-ов с тредами и комментариями...');

    const ivanReview = await prisma.review.create({
        data: {
            grade: 75,
            generalComment:
                'В целом неплохо, но есть замечания по стилю и обработке ошибок. Посмотри инлайн-комменты.',
            submissionId: ivanTodoSubmission.id,
            mentorId: mentorAlice.id,
        },
    });

    const ivanThread1 = await prisma.reviewThread.create({
        data: {
            filePath: 'src/components/TodoItem.tsx',
            line: 23,
            reviewId: ivanReview.id,
        },
    });

    await prisma.reviewComment.createMany({
        data: [
            {
                threadId: ivanThread1.id,
                authorId: mentorAlice.id,
                body: 'Здесь утечка состояния — обработчик создаётся заново при каждом рендере. Используй `useCallback`.',
            },
            {
                threadId: ivanThread1.id,
                authorId: studentIvan.id,
                body: 'Спасибо, понял! Поправлю в следующей итерации.',
            },
        ],
    });

    const ivanThread2 = await prisma.reviewThread.create({
        data: {
            filePath: 'src/hooks/useTodos.ts',
            line: 47,
            reviewId: ivanReview.id,
        },
    });

    await prisma.reviewComment.create({
        data: {
            threadId: ivanThread2.id,
            authorId: mentorAlice.id,
            body: 'Не забывай про обработку случая, когда `localStorage` недоступен (например, в приватном режиме браузера).',
        },
    });

    await prisma.review.create({
        data: {
            grade: 95,
            generalComment:
                'Отличная работа! Чистый код, хорошее покрытие тестами. Так держать.',
            submissionId: mariaTodoSubmission.id,
            mentorId: mentorAlice.id,
        },
    });

    const petrReview = await prisma.review.create({
        data: {
            grade: 50,
            generalComment:
                'CI красный — тесты падают. Также реализация quick sort работает некорректно на отсортированных массивах.',
            submissionId: petrSortSubmission.id,
            mentorId: mentorBob.id,
        },
    });

    const petrThread = await prisma.reviewThread.create({
        data: {
            filePath: 'src/quick_sort.py',
            line: 15,
            reviewId: petrReview.id,
        },
    });

    await prisma.reviewComment.create({
        data: {
            threadId: petrThread.id,
            authorId: mentorBob.id,
            body: 'Опорный элемент всегда первый — это даёт O(n²) на отсортированных данных. Используй random pivot или median-of-three.',
        },
    });

    console.log('✅ Seed выполнен успешно');
    console.log({
        users: 7,
        courses: 2,
        enrollments: 6,
        assignments: 3,
        submissions: 5,
        reviews: 3,
        threads: 3,
        comments: 4,
    });
}

seed()
    .catch((error) => {
        console.error('❌ Ошибка при выполнении seed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
