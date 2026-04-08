# Backend Documentation

Этот документ описывает архитектуру бэкенда, паттерны разработки и интеграции, которые не могут быть полностью отражены в OpenAPI спецификации.

## Архитектура

### Структура `src/backend/`

```
src/backend/
├── lib/
│   ├── prisma.ts            # PrismaClient singleton с MariaDB адаптером
│   ├── openapi.ts           # OpenAPIRegistry и генератор спецификации
│   ├── openapi-spec.ts      # Агрегатор всех schema импортов
│   └── openapi-mocks.ts     # Сканер src/mocks/ для Swagger UI
│
├── <entity>/
│   ├── repository.ts        # CRUD операции через Prisma
│   └── schema.ts            # Zod-схемы + регистрация в OpenAPI registry
│
├── users/                   # Пользователи (authentication, roles)
├── courses/                 # Курсы
├── enrollments/             # Регистрация студентов на курсы
├── assignments/             # Задания
├── submissions/             # Сдачи студентов
├── reviews/                 # Ревью работ (оценки + комментарии)
├── review-threads/          # Ветки обсуждения в ревью (по строкам кода)
├── review-comments/         # Комментарии в ревью-потоках
│
└── github/
    ├── classroom.ts         # GitHub Classroom API клиент + резолюция ролей
    └── schema.ts            # Zod-схемы для GitHub endpoints
```

### Паттерн разработки сущности

**Каждая сущность состоит из двух файлов:**

#### 1. `repository.ts` — слой данных

```ts
// src/backend/<entity>/repository.ts
import { prisma } from '@backend/lib/prisma'

export const <entity>Repository = {
    findAll() { /* ... */ },
    findById(id: number) { /* ... */ },
    create(data) { /* ... */ },
    update(id, data) { /* ... */ },
    delete(id) { /* ... */ },
}
```

- Единственный интерфейс с Prisma
- Возвращает готовые объекты (без преобразований)
- Используется из route handlers и GitHub API интеграции

#### 2. `schema.ts` — валидация + OpenAPI

```ts
// src/backend/<entity>/schema.ts
import { z } from 'zod'
import { registry } from '@backend/lib/openapi'

export const EntitySchema = registry.register(
    'Entity',
    z.object({
        /* поля */
    }),
)

export const CreateEntitySchema = z.object({
    /* ... */
})
export const UpdateEntitySchema = z.object({
    /* ... */
})

registry.registerPath({
    method: 'get',
    path: '/entities',
    tags: ['Entities'],
    summary: '...',
    responses: {
        /* ... */
    },
})
```

- Zod-схемы для валидации request body
- `registry.register()` создаёт компоненту в OpenAPI
- `registry.registerPath()` регистрирует endpoint в спецификации
- **Не забыть добавить `import '@backend/<entity>/schema'` в `openapi-spec.ts`**

### API Route Handlers

Все route handlers находятся в `src/app/api/`. Структура повторяет REST-соглашения:

```
src/app/api/
├── <entity>/route.ts          # GET (list) и POST (create)
└── <entity>/[id]/route.ts     # GET (by id), PATCH (update), DELETE (delete)
```

**Пример паттерна:**

```ts
import { NextRequest } from 'next/server'
import { <entity>Repository } from '@backend/<entity>/repository'
import { Create<Entity>Schema } from '@backend/<entity>/schema'

export async function GET() {
    const items = await <entity>Repository.findAll()
    return Response.json(items)
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const parsed = Create<Entity>Schema.safeParse(body)

    if (!parsed.success) {
        return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const item = await <entity>Repository.create(parsed.data)
    return Response.json(item, { status: 201 })
}
```

---

## Система ролей пользователей

### Модель данных

```prisma
enum Role {
  STUDENT
  MENTOR
  ADMIN
}

model User {
  role Role @default(STUDENT)
  // ...
}
```

### Как определяется роль

Роль пользователя может быть определена двумя способами:

#### 1. Из GitHub Teams (рекомендуется)

Функция `resolveRoleFromGitHubTeams(login: string): Promise<Role>` проверяет, в каких GitHub Teams состоит пользователь в организации `GITHUB_ORG`.

**Маппинг:**

- Пользователь в team `admins` → `ADMIN`
- Пользователь в team `mentors` → `MENTOR`
- Иначе → `STUDENT` (даже если не член организации)

**Использование:**

```ts
import { resolveRoleFromGitHubTeams } from '@backend/github/classroom'

const role = await resolveRoleFromGitHubTeams('octocat')
await userRepository.update(userId, { role })
```

**Требования:**

- `GITHUB_TOKEN` должен быть установлен (требует скоп `read:org`)
- `GITHUB_ORG` должен быть установлен в `.env`

#### 2. Вручную через API

```bash
PATCH /users/{id}
{
  "role": "MENTOR"
}
```

Используется для исключений или тестирования.

---

## Ручка GET /api/me

Возвращает профиль **текущего пользователя** с ролью.

### Поведение

| Режим           | USE_MOCKS | Ответ                                        |
| --------------- | --------- | -------------------------------------------- |
| **Development** | `true`    | 200 — первый пользователь из БД (с его role) |
| **Production**  | `false`   | 401 — требует аутентификации через Auth.js   |

### Response

```json
{
    "id": 1,
    "githubId": 12345,
    "login": "octocat",
    "name": "The Octocat",
    "email": "octocat@github.com",
    "avatar": "https://...",
    "role": "MENTOR",
    "createdAt": "2026-04-08T10:00:00Z",
    "updatedAt": "2026-04-08T10:00:00Z"
}
```

Поле `role` показывает текущую роль пользователя.

---

## Интеграция Auth.js (будущее)

### Что нужно сделать

Сейчас Auth.js не установлен. Когда он будет добавлен, нужно:

1. **Установить зависимости:**

    ```bash
    npm install @auth/nextjs @auth/github
    ```

2. **Создать `auth.ts` с конфигурацией GitHub OAuth:**

3. **Обновить `/api/me` в `src/app/api/me/route.ts`:**

    ```ts
    import { auth } from '@/auth'

    export async function GET() {
        const session = await auth()

        if (!session?.user?.githubId) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await userRepository.findByGithubId(
            Number(session.user.githubId),
        )

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
        }

        return Response.json(user)
    }
    ```

4. **Обновить `/api/users` (создание пользователя при первом логине):**

    ```ts
    export async function POST(request: NextRequest) {
        // ... валидация ...

        // Если пользователь новый — определить роль из GitHub Teams
        let role = data.role
        if (!role) {
            role = await resolveRoleFromGitHubTeams(data.login)
        }

        const user = await userRepository.create({ ...data, role })
        return Response.json(user, { status: 201 })
    }
    ```

5. **Создать Prisma migration:**
    ```bash
    npm run db:migrate
    ```
    (для добавления полей адаптера, если требуется)

---

## GitHub Organization и Teams

### Как добавить ментора в org

1. **Добавить пользователя в организацию `Frontend25-26`:**
    - Перейти на https://github.com/orgs/Frontend25-26/people
    - Нажать "Add member"
    - Выбрать пользователя и роль (желательно Owner или Maintainer)

2. **Добавить в team `mentors`:**
    - Перейти на https://github.com/orgs/Frontend25-26/teams/mentors
    - Нажать "Add a member"
    - Выбрать пользователя

3. **Проверить в приложении:**
    - Вызвать `GET /api/users` и создать запись пользователя (если её нет)
    - Вызвать `GET /api/me` → должна вернуться роль `MENTOR`

### Как добавить администратора

Аналогично, но добавить в team `admins` вместо `mentors`.

---

## Переменные окружения бэкенда

| Переменная           | Описание                                            | Пример                                                             |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`       | Connection string MySQL/MariaDB                     | `mysql://user:pass@localhost:3900/db?allowPublicKeyRetrieval=true` |
| `GITHUB_TOKEN`       | GitHub Personal Access Token (для GitHub API)       | Скоп: `read:org`                                                   |
| `GITHUB_ORG`         | GitHub Organization (для определения ролей)         | `Frontend25-26`                                                    |
| `USE_MOCKS`          | Использовать мок-responses вместо реальных запросов | `true` \| `false`                                                  |
| `AUTH_GITHUB_ID`     | GitHub App ID (для Auth.js)                         | _(не установлено)_                                                 |
| `AUTH_GITHUB_SECRET` | GitHub App Secret (для Auth.js)                     | _(не установлено)_                                                 |
| `AUTH_SECRET`        | Секретный ключ для Auth.js                          | _(не установлено)_                                                 |

---

## Добавление новой сущности — пошаговый чеклист

### 1. Обновить Prisma schema

```bash
# Отредактировать prisma/schema.prisma
# Добавить model NewEntity { ... }

npm run db:migrate
# Ввести название миграции (например: add_new_entity)

npm run db:generate
# Перегенерировать Prisma Client
```

### 2. Создать repository

```ts
// src/backend/new-entity/repository.ts
import { prisma } from '@backend/lib/prisma'

export const newEntityRepository = {
    findAll() {
        return prisma.newEntity.findMany()
    },
    findById(id) {
        return prisma.newEntity.findUnique({ where: { id } })
    },
    create(data) {
        return prisma.newEntity.create({ data })
    },
    update(id, data) {
        return prisma.newEntity.update({ where: { id }, data })
    },
    delete(id) {
        return prisma.newEntity.delete({ where: { id } })
    },
}
```

### 3. Создать schema

```ts
// src/backend/new-entity/schema.ts
import { z } from 'zod'
import { registry } from '@backend/lib/openapi'

export const NewEntitySchema = registry.register(
    'NewEntity',
    z.object({
        /* поля */
    }),
)

export const CreateNewEntitySchema = z.object({
    /* ... */
})

registry.registerPath({
    method: 'get',
    path: '/new-entities',
    tags: ['NewEntities'],
    // ...
})
```

### 4. Создать route handlers

```ts
// src/app/api/new-entities/route.ts
// src/app/api/new-entities/[id]/route.ts
```

### 5. Зарегистрировать в OpenAPI spec

```ts
// src/backend/lib/openapi-spec.ts
import '@backend/new-entity/schema' // ← добавить эту строку
```

### 6. Проверить

```bash
npm run dev
# Посетить http://localhost:3000/docs
# Проверить, что новые эндпоинты появились
```

---

## Тестирование бэкенда локально

### Используя Swagger UI

1. Открыть http://localhost:3000/docs
2. Развернуть нужный тег (например, "Users")
3. Нажать "Try it out"
4. Заполнить параметры, отправить запрос

### Используя curl

```bash
# GET /api/me
curl http://localhost:3000/api/me

# POST /api/users
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "githubId": 12345,
    "login": "octocat",
    "name": "The Octocat",
    "role": "MENTOR"
  }'

# PATCH /api/users/1
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}'
```

### Используя Prisma Studio

```bash
npm run db:studio
# Откроется браузер с GUI для просмотра и редактирования БД
```

---

## Известные ограничения и TODO

- Auth.js не подключён — `/api/me` возвращает первого пользователя в dev-режиме
- Авторизация не защищает остальные эндпоинты — все открыты для использования в dev
- Middleware для проверки сессии не реализован — добавить после Auth.js
- Логирование запросов минимально — можно расширить в `src/backend/lib/`
