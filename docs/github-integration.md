# GitHub Integration — техническая документация

Реализует issues #62–#70 (эпик #61): двусторонний мост между платформой и GitHub/GitHub Classroom.

---

## Быстрый старт: настройка с нуля

Полный путь от создания организации до рабочих эндпоинтов.

### Шаг 1. Создать GitHub Organization

1. Открой [github.com/organizations/new](https://github.com/organizations/new)
2. Выбери план **Free**
3. Задай slug (например `my-course-org`) — он понадобится как `GITHUB_ORG`
4. Пригласи менторов и студентов в организацию (Settings → Members)

### Шаг 2. Создать команды для ролей

В организации перейди **Settings → Teams → New team**:

| Название команды        | Роль на платформе |
| ----------------------- | ----------------- |
| `admins`                | ADMIN             |
| `mentors`               | MENTOR            |
| _(остальные участники)_ | STUDENT           |

Добавь нужных участников в каждую команду. Платформа читает эти команды через GitHub API при логине.

### Шаг 3. Создать GitHub Classroom

1. Открой [classroom.github.com](https://classroom.github.com) → **New classroom**
2. Выбери созданную организацию как владельца
3. Дай имя классруму (например `Spring 2026`)
4. Запомни **ID классрума** из URL: `classroom.github.com/classrooms/{ID}`

### Шаг 4. Создать задание в Classroom

1. Внутри классрума нажми **New assignment**
2. Выбери тип **Individual assignment**
3. Заполни:
    - **Title** — название (появится на платформе)
    - **Deadline** — дедлайн (подтянется в `dueDate`)
    - **Starter repository** — шаблон кода (опционально)
4. Сохрани → появится **invite link** и **assignment ID** в URL:
   `classroom.github.com/assignments/{ASSIGNMENT_ID}`
5. Запомни `ASSIGNMENT_ID`

### Шаг 5. Создать GitHub App

GitHub App привязан к организации, не к личному аккаунту — его можно передавать разработчикам и деплоить без личных токенов.

1. Перейди **GitHub → Organization Settings → Developer settings → GitHub Apps → New GitHub App**
2. Заполни:
    - **GitHub App name**: `HackathonProject Bot` (любое уникальное в рамках GitHub)
    - **Homepage URL**: `http://localhost:3000`
    - **Webhook**: сними галку **Active** (вебхуки настраиваются отдельно в шаге 10)
3. Выдай права (**Repository permissions**):
    - `Contents` → **Read-only** (чтение коммитов)
    - `Pull requests` → **Read-only** (список PR и файлов)
    - `Commit statuses` → **Read-only** (статус CI)
    - `Checks` → **Read-only** (GitHub Actions check runs)
4. Выдай права (**Organization permissions**):
    - `Members` → **Read-only** (Teams API для определения ролей)
5. Нажми **Create GitHub App**
6. На странице созданного приложения:
    - Скопируй **App ID** (число в верхней части страницы)
    - Прокрути вниз → **Private keys** → **Generate a private key** → скачается `.pem`-файл
7. Установи App в организацию: слева **Install App** → выбери организацию → **All repositories** → **Install**
8. После установки в URL страницы запомни **Installation ID**:
   `github.com/organizations/{org}/settings/installations/{INSTALLATION_ID}`

### Шаг 6. Зарегистрировать GitHub OAuth App

Нужен для аутентификации пользователей через `Sign in with GitHub`.

1. Перейди **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Заполни:
    - **Application name**: `HackathonProject`
    - **Homepage URL**: `http://localhost:3000`
    - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Нажми **Register application**
4. Скопируй **Client ID** и сгенерируй **Client Secret**

> Для production замени `localhost:3000` на реальный домен.

### Шаг 7. Настроить `.env`

Создай или обнови файл `.env` в корне проекта:

```env
# База данных
DATABASE_URL="mysql://root:password@localhost:3900/hackathon_dev"

# NextAuth (обязательно — случайная строка 32+ символа)
AUTH_SECRET="your-random-secret-here"

# GitHub OAuth App (из шага 6)
AUTH_GITHUB_ID="Ov23liABCDEF123456"
AUTH_GITHUB_SECRET="your_oauth_client_secret"

# GitHub App (из шага 5)
GITHUB_APP_ID="123456"
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEo...\n-----END RSA PRIVATE KEY-----"
GITHUB_INSTALLATION_ID="78901234"

# Название организации (slug из шага 1)
GITHUB_ORG="my-course-org"

# Секрет для webhook-подписей (любая случайная строка)
GITHUB_WEBHOOK_SECRET="your-webhook-secret-32chars"
```

### Шаг 8. Применить миграции и запустить

```bash
# Применить все миграции (включая github_integration)
npm run db:migrate

# Сгенерировать Prisma-клиент
npm run db:generate

# Запустить dev-сервер
npm run dev
```

### Шаг 9. Первый вход и роли

1. Открой `http://localhost:3000`
2. Войди через **Sign in with GitHub** под аккаунтом, который состоит в команде `admins`
3. Платформа автоматически определит роль ADMIN через GitHub Teams API
4. Аналогично войдут менторы (команда `mentors`) и студенты

### Шаг 10. Настроить webhook в GitHub

Это нужно для автоматического обновления данных (коммиты, CI-статус, комментарии).

> **Для локальной разработки** используй [ngrok](https://ngrok.com) или [smee.io](https://smee.io).
>
> Вариант 1 — smee:

```bash
npx smee-client --url https://smee.io/your-channel --target http://localhost:3000/api/github/webhooks
```

> Вариант 2 — ngrok:

```bash
ngrok http 3000
# скопируй URL вида https://abc123.ngrok.io
```

**Настройка webhook в организации** (обрабатывает все репозитории сразу):

1. GitHub → Organization Settings → **Webhooks → Add webhook**
2. Заполни:
    - **Payload URL**: `https://your-domain.com/api/github/webhooks`
    - **Content type**: `application/json`
    - **Secret**: значение `GITHUB_WEBHOOK_SECRET` из `.env`
3. Выбери события:
    - ✅ **Pushes**
    - ✅ **Pull requests**
    - ✅ **Pull request review comments**
    - ✅ **Check runs**
    - ✅ **Repositories** (для автообнаружения новых репо студентов)
4. Нажми **Add webhook**

### Шаг 11. Создать задание на платформе

Теперь всё готово для создания задания, которое привязано к Classroom:

```bash
curl -X POST http://localhost:3000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "classroomAssignmentId": 123456,
    "maxGrade": 100,
    "courseId": 1,
    "createdById": 1
  }'
```

Платформа автоматически подтянет `title`, `inviteLink`, `dueDate` из Classroom API.

### Шаг 12. Студент принимает задание

1. Студент входит на платформу → видит `inviteLink` в задании
2. Кликает → попадает на GitHub → принимает задание → Classroom создаёт репозиторий
3. **Платформа обнаруживает репо** автоматически (через webhook `repository.created`) **или** вручную:

```bash
# Ручная синхронизация (ADMIN)
curl -X POST http://localhost:3000/api/github/sync/1 \
  -H "Cookie: ..."
```

После этого в БД появится запись `Submission` со студентом.

### Шаг 13. Просматривать коммиты и diff

Когда студент делает push:

```bash
# Коммиты (из кэша в БД)
curl http://localhost:3000/api/submissions/1/commits \
  -H "Cookie: ..."

# Принудительное обновление из GitHub
curl "http://localhost:3000/api/submissions/1/commits?refresh=1" \
  -H "Cookie: ..."

# Diff файлов из PR
curl http://localhost:3000/api/submissions/1/diff \
  -H "Cookie: ..."
```

---

---

## Новые модели БД

### Assignment (расширена)

| Поле                    | Тип       | Описание                                           |
| ----------------------- | --------- | -------------------------------------------------- |
| `classroomAssignmentId` | `Int?`    | ID задания в GitHub Classroom (для автозаполнения) |
| `inviteLink`            | `String?` | Ссылка-приглашение из Classroom для студентов      |

### Submission (расширена)

| Поле        | Тип       | Описание                        |
| ----------- | --------- | ------------------------------- |
| `repoOwner` | `String?` | GitHub owner (org или username) |
| `repoName`  | `String?` | Имя репозитория                 |
| `prNumber`  | `Int?`    | Номер Pull Request студента     |

### ReviewThread (расширена)

| Поле             | Тип    | Описание                                                  |
| ---------------- | ------ | --------------------------------------------------------- |
| `githubThreadId` | `Int?` | ID review thread на GitHub для двусторонней синхронизации |

### ReviewComment (расширена)

| Поле              | Тип    | Описание                 |
| ----------------- | ------ | ------------------------ |
| `githubCommentId` | `Int?` | ID комментария на GitHub |

### User (расширена)

| Поле          | Тип       | Описание                                           |
| ------------- | --------- | -------------------------------------------------- |
| `githubToken` | `String?` | GitHub OAuth access token (сохраняется при логине) |

### Commit (новая)

| Поле           | Тип        | Описание                                            |
| -------------- | ---------- | --------------------------------------------------- |
| `id`           | `Int`      | PK                                                  |
| `sha`          | `String`   | SHA коммита                                         |
| `message`      | `String`   | Сообщение коммита                                   |
| `authorName`   | `String`   | Имя автора                                          |
| `authorLogin`  | `String?`  | GitHub логин автора                                 |
| `committedAt`  | `DateTime` | Время коммита                                       |
| `ciStatus`     | `CiStatus` | Статус CI (UNKNOWN/PENDING/RUNNING/SUCCESS/FAILURE) |
| `ciDetailsUrl` | `String?`  | Ссылка на GitHub Actions run                        |
| `submissionId` | `Int`      | FK → Submission                                     |

**Уникальный индекс:** `(submissionId, sha)`

### SyncLog (новая)

| Поле                 | Тип        | Описание                                                  |
| -------------------- | ---------- | --------------------------------------------------------- |
| `id`                 | `Int`      | PK                                                        |
| `entityType`         | `String`   | Тип сущности (`assignment`, `submission`)                 |
| `entityId`           | `Int?`     | ID сущности                                               |
| `action`             | `String`   | Название операции (`sync_commits`, `sync_pr_comments`, …) |
| `success`            | `Boolean`  | Успешно / с ошибкой                                       |
| `errorMessage`       | `String?`  | Текст ошибки если есть                                    |
| `rateLimitRemaining` | `Int?`     | Остаток GitHub API rate limit                             |
| `createdAt`          | `DateTime` | Время записи                                              |

---

## Новые API-эндпоинты

### #62 — GitHub Classroom задания

#### `POST /api/assignments`

Расширен: если передан `classroomAssignmentId`, автоматически подтягивает из Classroom `title`, `classroomUrl`, `inviteLink`, `dueDate`.

```json
// Запрос (минимальный — с classroomAssignmentId)
{
  "classroomAssignmentId": 123456,
  "maxGrade": 100,
  "courseId": 1,
  "createdById": 2
}

// Запрос (без classroomAssignmentId — все поля обязательны)
{
  "title": "ДЗ 1",
  "description": "Описание",
  "classroomUrl": "https://classroom.github.com/...",
  "maxGrade": 100,
  "dueDate": "2026-05-31T23:59:00Z",
  "courseId": 1,
  "createdById": 2
}
```

---

### #64 — История коммитов

#### `GET /api/submissions/:id/commits`

Возвращает коммиты из БД (кэш). Параметр `?refresh=1` принудительно синхронизирует с GitHub.

**Доступ:** владелец submission или MENTOR/ADMIN

```json
[
    {
        "id": 1,
        "sha": "abc123",
        "message": "feat: add solution",
        "authorName": "Ivan Petrov",
        "authorLogin": "ivanpetrov",
        "committedAt": "2026-05-13T10:00:00.000Z",
        "ciStatus": "SUCCESS",
        "ciDetailsUrl": "https://github.com/.../actions/runs/123",
        "submissionId": 42
    }
]
```

---

### #65 — Diff изменённых файлов

#### `GET /api/submissions/:id/diff`

Возвращает список файлов из PR (реальные данные из GitHub API, lazy-by-file через `patch`).

**Доступ:** владелец submission или MENTOR/ADMIN

```json
{
    "prNumber": 1,
    "files": [
        {
            "filename": "src/main.py",
            "status": "modified",
            "additions": 10,
            "deletions": 2,
            "changes": 12,
            "patch": "@@ -1,5 +1,13 @@\n ..."
        }
    ]
}
```

---

### #68/#69 — Webhooks от GitHub

#### `POST /api/github/webhooks`

Принимает события от GitHub. Публичный endpoint, но верифицирует подпись `GITHUB_WEBHOOK_SECRET`.

**Обрабатываемые события:**

- `push` → `syncCommits(submissionId)`
- `pull_request` (opened/reopened/synchronize) → обновляет `prNumber`, запускает `syncCommits`
- `pull_request_review_comment` (created) → `syncPRComments(submissionId)`
- `check_run` → `syncCommits(submissionId)` (обновление CI-статуса)
- `repository` (created) → `syncStudentRepos` для всех заданий с `classroomAssignmentId`

---

### #63 — Ручная синхронизация репозиториев студентов

#### `POST /api/github/sync/:assignmentId`

Триггер ручной синхронизации: определяет репозитории студентов, синхронизирует коммиты и PR-комментарии.

**Доступ:** ADMIN

```json
// Ответ
{ "ok": true, "synced": 15 }
```

---

### #70 — Журнал синхронизаций

#### `GET /api/sync-logs`

Журнал всех операций синхронизации с GitHub.

**Доступ:** ADMIN

**Query параметры:**

- `entityType` — фильтр по типу (`assignment` / `submission`)
- `entityId` — фильтр по ID сущности
- `limit` — количество записей (default: 100)

```json
[
    {
        "id": 1,
        "entityType": "submission",
        "entityId": 42,
        "action": "sync_commits",
        "success": true,
        "errorMessage": null,
        "rateLimitRemaining": 4987,
        "createdAt": "2026-05-14T09:00:00.000Z"
    }
]
```

---

## Новые backend-модули

| Файл                                                                          | Назначение                                                 |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [src/backend/github/classroom.ts](../src/backend/github/classroom.ts)         | GitHub Classroom API + rate-limit контроль                 |
| [src/backend/github/repos.ts](../src/backend/github/repos.ts)                 | Commits, CI, diff, PR comments API                         |
| [src/backend/github/sync.ts](../src/backend/github/sync.ts)                   | Сервис синхронизации (студ. репо, коммиты, PR-комментарии) |
| [src/backend/sync-logs/repository.ts](../src/backend/sync-logs/repository.ts) | Репозиторий журнала синхронизаций                          |
| [src/backend/sync-logs/schema.ts](../src/backend/sync-logs/schema.ts)         | Zod-схема + OpenAPI регистрация                            |

---

## Переменные окружения

Добавь в `.env`:

```env
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEo...\n-----END RSA PRIVATE KEY-----"
GITHUB_INSTALLATION_ID=78901234
GITHUB_ORG=your-org-slug
GITHUB_WEBHOOK_SECRET=secret
```

> `GITHUB_APP_PRIVATE_KEY` — содержимое `.pem`-файла в одну строку, переносы строк заменены на `\n`.
> Скопируй файл целиком и замени реальные переносы строк на литеральный `\n` перед вставкой в `.env`.

---

## Инструкция по тестированию

### 1. Тест #62 — Создание задания с Classroom

```bash
# 1. Получить список Classroom-заданий (нужен GITHUB_TOKEN + классрум)
curl -H "Cookie: ..." http://localhost:3000/api/github/classrooms
curl -H "Cookie: ..." "http://localhost:3000/api/github/classrooms/{classroomId}/assignments"

# 2. Создать задание, подтянув данные из Classroom
curl -X POST http://localhost:3000/api/assignments \
  -H "Cookie: ..." \
  -H "Content-Type: application/json" \
  -d '{"classroomAssignmentId": 123456, "maxGrade": 100, "courseId": 1, "createdById": 2}'

# Ожидание: ответ содержит inviteLink, title, dueDate из Classroom
```

### 2. Тест #63 — Автообнаружение репозиториев студентов

```bash
# Синхронизировать репозитории студентов для задания
curl -X POST http://localhost:3000/api/github/sync/1 \
  -H "Cookie: ..."  # аутентификация ADMIN

# Ожидание: в БД появились submissions для студентов, принявших задание
# Проверить: GET /api/submissions?assignmentId=1
```

### 3. Тест #64 — История коммитов

```bash
# Форс-синхронизация и получение коммитов
curl "http://localhost:3000/api/submissions/1/commits?refresh=1" \
  -H "Cookie: ..."

# Ожидание: массив коммитов с sha, message, ciStatus
```

### 4. Тест #65 — Diff файлов

```bash
curl http://localhost:3000/api/submissions/1/diff \
  -H "Cookie: ..."

# Ожидание: { prNumber: N, files: [{filename, patch, additions, ...}] }
```

### 5. Тест #67 — Комментарий из платформы → GitHub

```bash
# Создать комментарий в треде (у ментора должен быть githubToken в БД)
curl -X POST http://localhost:3000/api/review-comments \
  -H "Cookie: ..."  \
  -H "Content-Type: application/json" \
  -d '{"body": "Обрати внимание на строку 42", "threadId": 1}'

# Ожидание:
# 1. Комментарий создан в БД с githubCommentId
# 2. Тот же комментарий появился в PR на GitHub
```

### 6. Тест #68/#69 — Webhooks

```bash
# Настроить webhook в репозитории GitHub:
# Settings → Webhooks → Add webhook
# URL: https://your-domain.com/api/github/webhooks
# Secret: значение GITHUB_WEBHOOK_SECRET из .env
# Events: push, pull_request, pull_request_review_comment, check_run

# После push-а в репозиторий студента — коммиты должны автоматически появиться в БД
```

### 7. Тест #70 — Журнал синхронизаций

```bash
# Просмотр всех записей
curl http://localhost:3000/api/sync-logs \
  -H "Cookie: ..."  # ADMIN

# Фильтр по submission
curl "http://localhost:3000/api/sync-logs?entityType=submission&entityId=1&limit=10" \
  -H "Cookie: ..."
```

---

## Архитектурные решения

### Кэширование (#68)

Данные с GitHub хранятся в БД (модели `Commit`, `ReviewComment`, `ReviewThread`). При запросах коммитов и diff — отдаём из кэша мгновенно. Кэш обновляется:

1. **Webhook-событиями** (мгновенно при новом коммите/комментарии)
2. **Ручным триггером** (`POST /api/github/sync/:assignmentId`)
3. **При недоступности GitHub** — платформа продолжает работать на кэше

### Rate limiting (#69)

`githubFetch` читает заголовок `x-ratelimit-remaining`. При < 50 запросов — warning в лог. При 0 — бросает `GitHubRateLimitError` (не роняет UX, ошибка логируется в `SyncLog`).

### Безопасность (#69)

- Webhook-подпись верифицируется через HMAC-SHA256 + `timingSafeEqual`
- GitHub токены пользователей хранятся в БД (поле `githubToken` в `User`)
- Комментарии публикуются от имени пользователя (его токен), а не сервисного бота
