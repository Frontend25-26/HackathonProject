# Frontend Guidelines

Это живой документ — он описывает то, как мы пишем фронтенд в этом проекте.
Читай его перед тем, как добавлять новый экран, компонент или фичу.

---

## Технологии

| Что              | Что используем                           |
| ---------------- | ---------------------------------------- |
| Фреймворк        | Next.js 16 (App Router)                  |
| Язык             | TypeScript (strict mode)                 |
| UI-библиотека    | Gravity UI                               |
| Тема / стили     | ThemeProvider из Gravity UI, globals.css |
| Состояние        | Zustand                                  |
| Данные с сервера | fetch к собственным API-роутам Next.js   |

---

## Структура папок

Весь фронтенд живёт в `src/`. Порядок зависимостей — **строго сверху вниз**:

```
src/
├── app/          # Страницы и API-роуты (Next.js роутинг)
├── widgets/      # Крупные блоки UI (шапка, сайдбар, лейаут)
├── features/     # Фичи — логика с состоянием (авторизация и т.д.)
├── entities/     # Доменные типы и модели (user, course...)
└── shared/       # Утилиты и типы, которые нужны везде
```

**Правило**: `app` может импортировать из `widgets`, `widgets` — из `features`,
`features` — из `entities`, `entities` — из `shared`. Обратные импорты запрещены.
ESLint с плагином `boundaries` проверяет это автоматически.

### `index.ts` в каждом слайсе

Каждый слайс (папка внутри слоя) экспортирует наружу только то, что нужно другим слоям — через `index.ts`. Внутренние файлы не импортируются напрямую.

```
widgets/
└── course-card/
    ├── CourseCard.tsx         # внутренний файл
    ├── CourseCard.module.css  # внутренний файл
    └── index.ts               # публичное API слайса
```

```ts
// widgets/course-card/index.ts
export { CourseCard } from './CourseCard';
```

```ts
// Хорошо — импортируем через index.ts
import { CourseCard } from '@/widgets/course-card';

// Плохо — лезем внутрь слайса напрямую
import { CourseCard } from '@/widgets/course-card/CourseCard';
```

Это даёт возможность переименовывать и реорганизовывать файлы внутри слайса, не ломая импорты в других местах.

---

## Принципы написания кода

Эти два принципа — основа читаемого и поддерживаемого кода. Следуй им всегда.

### KISS — Keep It Simple, Stupid (не усложняй)

Пиши самое простое решение, которое работает. Если код сложно читать — он написан плохо.

```tsx
// Плохо — лишняя переменная, сложная логика
const isUserAllowedToSeePage = user !== null && user !== undefined && user.role === 'ADMIN';
if (isUserAllowedToSeePage === true) { ... }

// Хорошо — прямо и понятно
if (user?.role === 'ADMIN') { ... }
```

```tsx
// Плохо — компонент делает слишком много сразу
export const CoursePage: FC = () => {
    // здесь 200 строк: загрузка, фильтрация, рендер таблицы, модалка...
};

// Хорошо — каждый компонент отвечает за одно
export const CoursePage: FC = () => {
    return (
        <CoursePageLayout>
            <CourseFilter />
            <CourseTable />
        </CoursePageLayout>
    );
};
```

**Правило**: если объясняешь коллеге, что делает функция, и тратишь больше одного предложения — упрости её.

### DRY — Don't Repeat Yourself (не повторяйся)

Если один и тот же код встречается дважды — вынеси его в функцию или компонент.
Если трижды — это точно нужно выносить.

```tsx
// Плохо — логика форматирования скопирована в трёх местах
<span>{new Date(course.createdAt).toLocaleDateString('ru-RU')}</span>
<span>{new Date(assignment.dueDate).toLocaleDateString('ru-RU')}</span>
<span>{new Date(review.updatedAt).toLocaleDateString('ru-RU')}</span>

// Хорошо — одна функция, используем везде
const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('ru-RU');

<span>{formatDate(course.createdAt)}</span>
<span>{formatDate(assignment.dueDate)}</span>
<span>{formatDate(review.updatedAt)}</span>
```

**Важно**: DRY не означает «объединить всё похожее». Если два куска кода похожи внешне,
но решают разные задачи — не объединяй. Объединяй только когда смысл одинаковый.

---

## Страницы

Страницы хранятся в `src/app/` и организованы по группам роутов:

```
src/app/
├── (app)/        # Защищённые страницы (требуют авторизации)
├── (auth)/       # Страницы авторизации (/login)
└── (service)/    # Служебные страницы (/forbidden, /docs)
```

Каждая страница — это файл `page.tsx` внутри своей папки.

**`page.tsx` — единственное место в проекте, где используется `export default`.**
Next.js требует этого для роутинга — страница должна быть дефолтным экспортом.

```tsx
// src/app/(app)/student/page.tsx
export default function StudentPage() {
    return <div>...</div>;
}
```

Если компонент использует хуки или браузерные API — добавь `'use client'` первой строкой.
Если нет — оставь как Server Component (по умолчанию), это быстрее.

---

## Компоненты

### Базовые правила

- Пиши **функциональные компоненты** — никаких классов.
- Используй **именованный экспорт** (`export const`) — для всего, кроме `page.tsx`.
- `export default` — **только в `page.tsx`**, нигде больше.
- Типизируй пропсы отдельным интерфейсом.
- Всегда пиши через **function expression** (стрелочная функция), не через `function`.

```tsx
// Хорошо — именованный экспорт, function expression, типизированные пропсы
interface UserCardProps {
    name: string;
    role: Role;
}

export const UserCard: FC<UserCardProps> = ({ name, role }) => {
    return (
        <div>
            {name} — {role}
        </div>
    );
};
```

```tsx
// Плохо — default export вне page.tsx, нет типов
export default function ({ name }) {
    return <div>{name}</div>;
}
```

Почему именованный экспорт лучше:

- При импорте IDE сразу подсказывает правильное имя — нельзя случайно назвать компонент иначе
- Легко найти все места использования через "Find References"
- `export default` зарезервирован для страниц — это соглашение сразу говорит "это page.tsx"

### Функции через function expression

```ts
// Хорошо — function expression
export const fetchCourse = async (id: number): Promise<Response> => {
    return fetch(`/api/courses/${id}`);
};
```

### Порядок элементов внутри компонента

Соблюдай этот порядок — тогда любой файл будет предсказуемым:

```tsx
'use client'; // 1. Директива (если нужна) — всегда первая строка

// 2. Импорты (см. раздел "Порядок импортов")
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Button } from '@gravity-ui/uikit';
import type { Course } from '@/entities/course';
import styles from './CourseCard.module.css';

// 3. Enum'ы и константы, специфичные для этого компонента
enum CardSize {
    Small = 'small',
    Large = 'large',
}

const MAX_TITLE_LENGTH = 60;

// 4. Интерфейс пропсов
interface CourseCardProps {
    course: Course;
    size?: CardSize;
}

// 5. Сам компонент
export const CourseCard: FC<CourseCardProps> = ({
    course,
    size = CardSize.Small,
}) => {
    // 5a. Хуки (useState, useEffect, useRef, кастомные)
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // 5b. Производные значения (вычисляются из пропсов/стейта)
    const title = course.title.slice(0, MAX_TITLE_LENGTH);

    // 5c. Обработчики событий
    const handleToggle = (): void => {
        setIsExpanded((prev) => !prev);
    };

    // 5d. Эффекты
    useEffect(() => {
        document.title = course.title;
    }, [course.title]);

    // 5e. Ранний возврат (если нечего рендерить)
    if (!course) return null;

    // 5f. JSX
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{title}</h2>
            <Button onClick={handleToggle}>
                {isExpanded ? 'Свернуть' : 'Развернуть'}
            </Button>
        </div>
    );
};
```

### Если компонент принимает дочерние элементы

```tsx
import type { FC, PropsWithChildren } from 'react';

interface SidebarProps extends PropsWithChildren {
    isOpen: boolean;
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, children }) => {
    return isOpen ? <nav>{children}</nav> : null;
};
```

### Максимально используй Server Components (SSR)

По умолчанию все компоненты в Next.js — серверные. Данные загружаются на сервере и пользователь сразу видит готовую страницу без мерцания.

**Стратегия**: делай как можно больше на сервере, `'use client'` добавляй только там где без него не обойтись.

```tsx
// Плохо — данные грузятся на клиенте, пользователь видит пустую страницу
'use client';
export const CoursePage: FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    useEffect(() => {
        apiFetch<Course[]>('/api/courses').then(setCourses);
    }, []);
    return <CourseList courses={courses} />;
};

// Хорошо — данные загружаются на сервере, страница приходит уже заполненной
// page.tsx (Server Component — нет 'use client')
export default async function CoursePage() {
    const courses = await apiFetch<Course[]>('/api/courses');
    return <CourseList courses={courses} />;
}
```

Передавай данные из серверного компонента в клиентский через пропсы:

```tsx
// page.tsx — серверный, загружает данные один раз
export default async function CoursePage() {
    const courses = await apiFetch<Course[]>('/api/courses');
    return <CourseFilter courses={courses} />;
}

// CourseFilter.tsx — клиентский, только интерактивность
('use client');
interface CourseFilterProps {
    courses: Course[];
}
export const CourseFilter: FC<CourseFilterProps> = ({ courses }) => {
    const [query, setQuery] = useState<string>('');
    const filtered = courses.filter((c) => c.title.includes(query));
    return <>{/* ... */}</>;
};
```

### Директива `'use client'`

Добавляй `'use client'` только тогда, когда компоненту нужны:

- хуки (`useState`, `useEffect`, `useContext` и т.д.)
- браузерные события (`onClick`, `onChange`)
- доступ к `window`, `document`

```tsx
'use client';

import { useState } from 'react';
import type { FC } from 'react';

type Theme = 'dark' | 'light';

export const ThemeToggle: FC = () => {
    const [theme, setTheme] = useState<Theme>('dark');

    const handleToggle = (): void => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return <button onClick={handleToggle}>Toggle</button>;
};
```

---

## Enum для связанных значений

Если у тебя есть несколько связанных строковых значений (статусы, роли, типы) — используй `enum` со строковыми значениями, а не разрозненные строки.

```ts
// Плохо — магические строки разбросаны по коду
if (status === 'pending') { ... }
if (status === 'approved') { ... }
<span className={status === 'rejected' ? 'red' : 'green'} />

// Хорошо — всё в одном месте, опечатка поймается TypeScript
enum SubmissionStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}

if (status === SubmissionStatus.Pending) { ... }
<span className={status === SubmissionStatus.Rejected ? styles.red : styles.green} />
```

Почему строковые значения (не числовые):

- Читаемы в логах, сети и БД: `"pending"`, а не `2`
- Не сломаются при добавлении нового значения в середину

---

## Нет магическим числам

Магическое число — любое число прямо в коде без объяснения, что оно значит.

```ts
// Плохо — что такое 60? почему 3?
if (title.length > 60) { ... }
const chunks = items.slice(0, 3);

// Хорошо — названия объясняют смысл
const MAX_TITLE_LENGTH = 60;
const PREVIEW_ITEMS_COUNT = 3;

if (title.length > MAX_TITLE_LENGTH) { ... }
const chunks = items.slice(0, PREVIEW_ITEMS_COUNT);
```

Константы объявляй рядом с тем местом, где они используются:

- Только в одном компоненте → объяви перед компонентом в том же файле
- В нескольких файлах → вынеси в `src/shared/constants.ts`

---

## UI-компоненты (Gravity UI)

Мы используем готовые компоненты из `@gravity-ui/uikit`. **Не изобретай кнопки, инпуты
и таблицы с нуля** — сначала проверь, есть ли нужный компонент в Gravity UI.

Тема оборачивает всё приложение через `ThemeProvider`:

```tsx
import { ThemeProvider } from '@gravity-ui/uikit';

<ThemeProvider theme="dark">{children}</ThemeProvider>;
```

---

## Стейт-менеджмент (Zustand)

Используй Zustand для глобального состояния, которое нужно в нескольких местах.
Локальное состояние одного компонента — `useState`.

```ts
// src/features/some-feature/store.ts
import { create } from 'zustand';

interface CourseStore {
    selectedId: number | null;
    select: (id: number) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
    selectedId: null,
    select: (id) => set({ selectedId: id }),
}));
```

---

## Стили (CSS Modules)

Мы **не используем BEM**. Стили пишем через CSS Modules — каждый компонент имеет свой файл `ComponentName.module.css`.

### Создание файла стилей

```
widgets/
└── course-card/
    ├── CourseCard.tsx
    └── CourseCard.module.css   ← файл стилей рядом с компонентом
```

### Подключение и использование

```tsx
// CourseCard.tsx
import styles from './CourseCard.module.css';

export const CourseCard: FC<CourseCardProps> = ({ title, description }) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
        </div>
    );
};
```

```css
/* CourseCard.module.css */
.card {
    padding: 16px;
    border-radius: 8px;
    background: var(--g-color-base-background);
}

.title {
    font-size: 18px;
    font-weight: 600;
}

.description {
    color: var(--g-color-text-secondary);
}
```

### Несколько классов на одном элементе

```tsx
// Через шаблонную строку
<div className={`${styles.card} ${styles.cardActive}`} />;

// Через библиотеку clsx (предпочтительно при условиях)
import clsx from 'clsx';

<div className={clsx(styles.card, { [styles.cardActive]: isActive })} />;
```

### Правила именования классов в CSS

- `camelCase` для имён классов: `.cardTitle`, `.submitButton`
- Имя отражает роль элемента, а не его внешний вид:

```css
/* Плохо — описывает как выглядит */
.redBoldText {
    color: red;
    font-weight: bold;
}

/* Хорошо — описывает что это */
.errorMessage {
    color: var(--g-color-text-danger);
    font-weight: 600;
}
```

---

## Запросы к API

Все запросы идут к собственным API-роутам (`/api/...`). Используй хелпер `apiFetch` из `@/shared/api` — **не пиши `fetch` напрямую**.

`apiFetch` автоматически:

- проставляет `Content-Type: application/json`
- пробрасывает cookies (включая сессию NextAuth) — как на клиенте, так и на сервере
- бросает `ApiError` с HTTP-статусом при неуспешном ответе, а не молча возвращает объект ошибки

```ts
import { apiFetch, ApiError } from '@/shared/api';

// GET без параметров
const courses = await apiFetch<Course[]>('/api/courses');

// GET с query-параметрами
const assignments = await apiFetch<Assignment[]>('/api/assignments', {
    query: { courseId: 42 },
});

// POST с телом
const created = await apiFetch<Course>('/api/courses', {
    method: 'POST',
    body: { title: 'Новый курс', mentorId: 1 },
});

// Обработка ошибки
try {
    const course = await apiFetch<Course>('/api/courses/999');
} catch (e) {
    if (e instanceof ApiError) {
        console.error(e.status, e.data); // 404, { error: 'Not found' }
    }
}
```

В `'use client'`-компонентах вызывай `apiFetch` внутри `useEffect` или обработчиков событий.
В Server Components — вызывай напрямую: `await apiFetch(...)`, origin и cookies подставятся автоматически.

---

## TypeScript

### Явная типизация функций

Всегда указывай типы аргументов и возвращаемое значение у функций.

```ts
// Плохо — TypeScript сам выведет типы, но читателю непонятно что ожидать
const formatDate = (iso) => new Date(iso).toLocaleDateString('ru-RU');

// Хорошо — явно и однозначно
const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('ru-RU');
```

Для generic-функций — указывай тип-параметр явно:

```ts
// Плохо — нет generic, теряем типобезопасность
const getFirst = (items: unknown[]): unknown => items[0];

// Хорошо — generic сохраняет тип и на входе и на выходе
const getFirst = <T>(items: T[]): T | undefined => items[0];

// Использование — TypeScript знает что вернётся Course, а не unknown
const first = getFirst<Course>(courses);
```

Async-функции — тип возврата через `Promise<T>`:

```ts
const fetchCourses = async (): Promise<Course[]> => {
    const response = await fetch('/api/courses');
    return response.json();
};
```

### Импорты типов

Если импортируешь только тип — используй `import type`:

```ts
import type { FC } from 'react';
import type { Role } from '@/entities/user';
```

### Path aliases

Используй алиасы вместо относительных путей:

```ts
// Хорошо
import { userRepository } from '@backend/users/repository';
import type { Role } from '@/entities/user';

// Плохо
import { userRepository } from '../../../backend/users/repository';
```

Настроенные алиасы:

- `@/*` → `src/*`
- `@backend/*` → `src/backend/*`

### Именование

| Что                          | Стиль              | Пример                        |
| ---------------------------- | ------------------ | ----------------------------- |
| Переменные, функции          | `camelCase`        | `currentUser`, `fetchCourses` |
| Компоненты, типы, интерфейсы | `PascalCase`       | `UserCard`, `CourseProps`     |
| Константы                    | `UPPER_SNAKE_CASE` | `ALL_ROLES`, `MAX_GRADE`      |
| Файлы компонентов            | `PascalCase.tsx`   | `Sidebar.tsx`                 |
| Файлы утилит                 | `camelCase.ts`     | `formatDate.ts`               |

---

## Форматирование кода

Настроено в `.prettierrc.json`. Не меняй эти настройки вручную — просто запускай:

```bash
npm run lint:fix
```

Основные правила:

- Отступы: **4 пробела** (не табы)
- Одинарные кавычки: `'string'`
- Точки с запятой: обязательны
- Trailing commas: всегда

---

## Порядок импортов

ESLint следит за порядком. Группы сверху вниз:

```ts
// 1. Node.js built-ins (если нужны)
import path from 'path';

// 2. Внешние пакеты
import { useState } from 'react';
import type { FC } from 'react';

// 3. Внутренние алиасы
import { UserCard } from '@/widgets/user-card';
import type { Role } from '@/entities/user';

// 4. Относительные импорты
import { formatDate } from './utils';
```

---

## Что проверять перед коммитом

Линтер запускается **автоматически при каждом коммите** через pre-commit хук — руками запускать не нужно. Если хук упал, коммит не создастся, пока не исправишь ошибки.

Для ручной проверки или фикса:

```bash
npm run lint       # ESLint + Prettier + TypeScript
npm run lint:fix   # Автофикс форматирования и простых ошибок
```

Если линтер ругается — исправь причину, не добавляй `// eslint-disable`.
