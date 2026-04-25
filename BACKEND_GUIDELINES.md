# Backend Guidelines

Это живой документ — он описывает то, как мы пишем бэкенд в этом проекте.
Читай его перед тем, как добавлять новый API-эндпоинт, репозиторий или схему.

---

## Технологии

| Что              | Что используем                      |
| ---------------- | ----------------------------------- |
| Фреймворк        | Next.js API Routes (Route Handlers) |
| ORM              | Prisma 7                            |
| База данных      | MariaDB / MySQL                     |
| Валидация        | Zod                                 |
| Авторизация      | NextAuth 5 (GitHub OAuth)           |
| API-документация | OpenAPI (через `zod-to-openapi`)    |

---

## Структура папок

Весь бэкенд живёт в двух местах:

```
src/
├── app/api/           # HTTP-эндпоинты (роут-хендлеры Next.js)
│   ├── (admin)/       # Только для ADMIN
│   ├── (mentor)/      # Для MENTOR и ADMIN
│   ├── (protected)/   # Для любого авторизованного пользователя
│   └── (public)/      # Без авторизации
└── backend/           # Бизнес-логика и доступ к данным
    ├── lib/           # Общие утилиты (auth, prisma, openapi)
    ├── users/         # Пример домена: repository.ts + schema.ts
    ├── courses/
    ├── assignments/
    └── ...
```

Каждый **домен** (users, courses, assignments...) содержит два файла:

- `repository.ts` — операции с базой данных
- `schema.ts` — Zod-схемы + регистрация OpenAPI

---

## Роут-хендлеры (API Routes)

Каждый файл `route.ts` экспортирует функции с именами HTTP-методов: `GET`, `POST`, `PATCH`, `DELETE`.
Используй **function expression** (стрелочные функции), а не `function` declaration.

### Шаблон роута

```ts
// src/app/api/(protected)/courses/route.ts
import { NextRequest } from 'next/server';
import { courseRepository } from '@backend/courses/repository';
import { CreateCourseSchema } from '@backend/courses/schema';
import { requireAuth, requireMentor } from '@backend/lib/auth';

export const GET = async (request: NextRequest): Promise<Response> => {
    // 1. Проверяем авторизацию
    const auth = await requireAuth(request);
    if (!auth.ok) return auth.response;

    // 2. Получаем данные
    const courses = await courseRepository.findAll();

    // 3. Возвращаем ответ
    return Response.json(courses);
};

export const POST = async (request: NextRequest): Promise<Response> => {
    // 1. Проверяем роль (только ментор или выше)
    const auth = await requireMentor(request);
    if (!auth.ok) return auth.response;

    // 2. Валидируем тело запроса
    const body: unknown = await request.json();
    const parsed = CreateCourseSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 });
    }

    // 3. Создаём запись
    const course = await courseRepository.create(parsed.data);

    return Response.json(course, { status: 201 });
};
```

### Правила роутов

- **Всегда** начинай с проверки авторизации — первым делом.
- Используй `safeParse`, а не `parse` — чтобы вернуть 400, а не упасть с ошибкой.
- Возвращай `Response.json(...)`, не устаревший `NextResponse`.
- Группа роута (`(admin)`, `(mentor)`, `(protected)`, `(public)`) — декларативное указание,
  кто может сюда ходить. Но проверку в коде всё равно делай.

---

## Авторизация

Функции-гарды живут в [src/backend/lib/auth.ts](src/backend/lib/auth.ts).

| Функция                             | Кто проходит                      |
| ----------------------------------- | --------------------------------- |
| `requireAuth(request)`              | Любой авторизованный пользователь |
| `requireMentor(request)`            | MENTOR или ADMIN                  |
| `requireAdmin(request)`             | Только ADMIN                      |
| `isOwnerOrMentor(request, ownerId)` | Владелец ресурса или MENTOR/ADMIN |

Все функции возвращают **дискриминированный union**:

```ts
type AuthResult =
    | { ok: true; user: AuthUser }
    | { ok: false; response: Response };
```

Поэтому паттерн всегда одинаковый:

```ts
const auth = await requireAdmin(request);
if (!auth.ok) return auth.response; // автоматически 401 или 403
// здесь auth.user гарантированно существует
```

### Роли

```ts
type Role = 'STUDENT' | 'MENTOR' | 'ADMIN';
```

Роль назначается при первом входе через GitHub OAuth — исходя из команды в GitHub Teams.
Если команда не найдена — пользователь получает роль `STUDENT`.

---

## Репозиторий (доступ к данным)

Весь доступ к БД — только через репозитории. **Никогда не пиши `prisma.xxx` напрямую в роуте.**

Репозиторий — это **класс**. Инстанс экспортируется как синглтон.

### Шаблон репозитория

```ts
// src/backend/courses/repository.ts
import { prisma } from '@backend/lib/prisma';
import type { Course, Prisma } from '@backend/generated/prisma';

type CreateCourseData = {
    title: string;
    description: string;
    mentorId: number;
};

type UpdateCourseData = Partial<Omit<CreateCourseData, 'mentorId'>>;

class CourseRepository {
    async findAll(): Promise<Course[]> {
        return prisma.course.findMany({
            include: { mentor: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: number): Promise<Course | null> {
        return prisma.course.findUnique({
            where: { id },
            include: { mentor: true, assignments: true },
        });
    }

    async create(data: CreateCourseData): Promise<Course> {
        return prisma.course.create({ data });
    }

    async update(id: number, data: UpdateCourseData): Promise<Course> {
        return prisma.course.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Course> {
        return prisma.course.delete({ where: { id } });
    }
}

export const courseRepository = new CourseRepository();
```

### Почему класс, а не объект?

- Класс явно показывает, что это сущность с методами — а не набор случайных функций
- Методы в классе легко читаются: видно что `async`, виден возвращаемый тип
- Можно расширить (`extends`) или подменить в тестах

### Правила репозитория

- Все методы, которые обращаются к БД, — **async** с явным `Promise<T>` возвратом.
- Типизируй аргументы явно — никакого `any`.
- Только Prisma-вызовы внутри — никакой бизнес-логики.
- Не делай `try/catch` — пусть ошибки всплывают в роут.
- Экспортируй единственный инстанс: `export const courseRepository = new CourseRepository()`.

---

## Валидация (Zod)

Схемы живут в `schema.ts` рядом с репозиторием.

### Шаблон схемы

```ts
// src/backend/courses/schema.ts
import { z } from 'zod';

// Полная схема объекта (для документации и ответов)
export const CourseSchema = z.object({
    id: z.number().int(),
    title: z.string(),
    description: z.string(),
    mentorId: z.number().int(),
    createdAt: z.string().datetime(),
});

// Схема для создания (без id и createdAt — их генерирует БД)
export const CreateCourseSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    mentorId: z.number().int(),
});

// Схема для обновления (все поля опциональны)
export const UpdateCourseSchema = CreateCourseSchema.partial();
```

### Использование в роуте

```ts
const parsed = CreateCourseSchema.safeParse(body);
if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
}
// parsed.data теперь типизирован и валиден
const course = await courseRepository.create(parsed.data);
```

---

## База данных (Prisma)

### Prisma-клиент

Используй единственный глобальный экземпляр из [src/backend/lib/prisma.ts](src/backend/lib/prisma.ts):

```ts
import { prisma } from '@backend/lib/prisma';
```

Никогда не создавай `new PrismaClient()` самостоятельно.

### Схема и миграции

Схема БД: [prisma/schema.prisma](prisma/schema.prisma)

```bash
# Создать и применить новую миграцию
npm run db:migrate

# Перегенерировать Prisma-клиент после изменений схемы
npm run db:generate

# Открыть визуальный редактор данных
npm run db:studio
```

**После любого изменения `schema.prisma` обязательно запускай `db:generate`.**

### Соглашения схемы

- Первичный ключ: `id Int @id @default(autoincrement())`
- Временные метки: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
- Связи именуй по имени сущности: `mentor User @relation(...)`, `course Course @relation(...)`

---

## OpenAPI-документация

Каждый эндпоинт должен быть задокументирован в `schema.ts` через `registry.registerPath(...)`.

```ts
// src/backend/courses/schema.ts
import { registry, addAccessTag } from '@backend/lib/openapi';
import { z } from 'zod';

registry.registerPath({
    method: 'get',
    path: '/courses',
    tags: ['Courses'],
    summary: addAccessTag('Список курсов', 'STUDENT'),
    responses: {
        200: {
            description: 'Успешно',
            content: { 'application/json': { schema: z.array(CourseSchema) } },
        },
    },
});
```

Документация доступна в браузере по адресу `/api/docs`.

---

## Dev-режим (моки)

Когда `USE_MOCKS=true` в `.env`, авторизация работает через заголовок `x-mock-user-id`:

| Значение заголовка | Роль    |
| ------------------ | ------- |
| `1`                | STUDENT |
| `2`                | MENTOR  |
| `3`                | ADMIN   |

В Swagger-UI (в dev-режиме) это настраивается автоматически — не нужно вводить токен.

---

## Именование

| Что                 | Стиль              | Пример                             |
| ------------------- | ------------------ | ---------------------------------- |
| Переменные, функции | `camelCase`        | `courseRepository`, `findById`     |
| Типы, интерфейсы    | `PascalCase`       | `AuthResult`, `CreateCourseSchema` |
| Константы           | `UPPER_SNAKE_CASE` | `USE_MOCKS`, `ALL_ROLES`           |
| Файлы               | `camelCase.ts`     | `repository.ts`, `schema.ts`       |

---

## Типичные HTTP-статусы

| Ситуация                            | Статус |
| ----------------------------------- | ------ |
| Успешный GET / PATCH                | `200`  |
| Успешный POST (создание)            | `201`  |
| Неверные данные от клиента          | `400`  |
| Нет авторизации (не залогинен)      | `401`  |
| Нет прав (залогинен, но роль не та) | `403`  |
| Запись не найдена                   | `404`  |

---

## Чеклист нового эндпоинта

1. Создай (или обнови) `schema.ts` — добавь Zod-схему и `registry.registerPath`.
2. Создай (или обнови) `repository.ts` — добавь нужные методы.
3. Создай файл роута в `src/app/api/(нужная-группа)/путь/route.ts`.
4. Внутри роута: авторизация → валидация → репозиторий → ответ.
5. Проверь через Swagger (`/api/docs`) или через curl / Postman.
