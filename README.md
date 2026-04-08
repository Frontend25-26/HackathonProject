# Hackathon Project

## Стек

- **Next.js**
- **TypeScript**
- **ESLint**
- **SCSS Modules / Tailwind CSS**

## Feature-Sliced Design

```text
src/
├── app/          # Next.js App Router: layouts, pages, providers
├── features/     # Фичи: auth, homework, pr-viewer, admin
├── entities/     # Сущности: user, homework, pr, review
├── shared/       # UI-кит, утилиты, конфиг API, типы
└── widgets/      # Составные блоки страниц
```

## 🚀 Локальная разработка

### 1. Подготовка окружения

Скопируй `.env.example` в `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Заполни `.env.local`

- **`AUTH_GITHUB_ID`** и **`AUTH_GITHUB_SECRET`** — попроси у куратора в приватном чате
- **`AUTH_SECRET`** — сгенерируй сам:

  ```bash
  openssl rand -base64 32
  ```

- **`NEXTAUTH_URL`** — оставь как есть (`http://localhost:3000`)
- **`GITHUB_ORG`** — оставь как есть (`Frontend25-26`)

### 3. Запусти БД и примени миграции

```bash
npm install
docker compose up -d
npm run db:migrate
```

### 4. Запусти проект

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000) — всё готово!

### ⚠️ Важно

- **Никогда не коммитьте `.env.local`** — он в `.gitignore`
- Не делись `AUTH_GITHUB_SECRET` и `AUTH_SECRET` публично

## Команды запуска

```bash
npm run start       # Запустить приложение
npm run dev         # Запуск сборки для разработчиков
npm run build       # Сборка
npm run lint        # Проверка кода линтером
npm run lint:fix    # Автоматические изменения линтером
npm test            # Запуск тестов
```

## Conventional Commits

```text
fix:      исправление бага
feat:     новая функциональность
build:    изменения системы сборки
chore:    обновление зависимостей
ci:       изменение CI/CD конфигурации
docs:     только документация
style:    форматирование, без логики
refactor: рефакторинг без новых фич
perf:     улучшение производительности
test:     добавление тестов
```

## Найминг веток

```text
feat/{n}
fix/{n}
refactor/{n}
```

## База данных

Проект использует MySQL 8.4, запускаемую через Docker, и Prisma ORM.

### Запуск

1. Скопируй `.env.example` в `.env` и заполни переменные:

   ```bash
   cp .env.example .env
   ```

2. Подними БД:

   ```bash
   docker compose up -d
   ```

3. Примени миграции:

   ```bash
   npm run db:migrate
   ```

4. Сгенерируй Prisma Client:

   ```bash
   npm run db:generate
   ```

5. Запусти проект:

   ```bash
   npm run dev
   ```

### Команды для работы с БД

```bash
npm run db:migrate         # Создать и применить новую миграцию (dev)
npm run db:migrate:deploy  # Применить миграции без создания новых (prod/CI)
npm run db:generate        # Перегенерировать Prisma Client после изменений схемы
npm run db:studio          # Открыть Prisma Studio (GUI для просмотра данных)
```

### Создание новой миграции

После изменения `prisma/schema.prisma`:

```bash
npm run db:migrate
# Prisma спросит название миграции, например: add_user_avatar
```

### Переменные окружения

| Переменная | Описание | Пример |
| --- | --- | --- |
| `MYSQL_ROOT_PASSWORD` | Пароль root пользователя MySQL | `rootpassword` |
| `MYSQL_DATABASE` | Название БД | `hackathon_dev` |
| `MYSQL_USER` | Пользователь БД | `hackathon` |
| `MYSQL_PASSWORD` | Пароль пользователя БД | `hackathon` |
| `MYSQL_HOST` | Хост БД | `localhost` |
| `MYSQL_PORT` | Порт БД | `3306` |

> По умолчанию стоит **порт 3900** — нестандартный, так как Hyper-V на Windows резервирует диапазон 3053–3852.

### Структура миграций

```text
prisma/
├── schema.prisma        # Схема БД (источник истины)
└── migrations/
    └── 20260330_init/
        └── migration.sql
```

Миграции коммитятся в репозиторий. Не редактируйте уже применённые файлы `migration.sql` вручную.

---

## Backend & Mocks

Все API-запросы фронтенда проксируются через `src/app/api/[...path]/route.ts`. Режим работы определяется переменной окружения `USE_MOCKS`.

### Режим моков (`USE_MOCKS=true`)

Запросы обслуживаются из файлов в `src/mocks/`. Структура папок повторяет URL:

```text
GET /api/user --> src/mocks/user/GET.json
GET /api/user/alice/hw/1 --> src/mocks/user/[name]/hw/[number]/GET.json
```

- Сначала ищется точное совпадение папки, затем - динамический сегмент `[param]`
- Файл мока выбирается по имени HTTP-метода (`GET.json`, `POST.json` и т.д.), fallback - `index.json`

Формат файла мока:

```json
{
    "_status": 200,
    "_delay": 500,
    "field": "value"
}
```

`_status` и `_delay` - служебные поля (статус ответа и задержка в мс), в тело ответа не попадают.

---

## Swagger

Документация API доступна по адресу [/docs](http://localhost:3000/docs) при запущенном dev-сервере.

Спецификация генерируется автоматически из Zod-схем — отдельно писать JSDoc не нужно.

### Моки в Swagger

Все файлы из `src/mocks/` автоматически отображаются во вкладке **Mocks**.
При добавлении нового мок-файла перезапусти dev-сервер — новый эндпоинт появится в документации.
