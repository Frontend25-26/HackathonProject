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
## Команды запуска
```bash
npm run start       Запустить приложение
npm run dev         Запуск сборки для разработчиков 
npm run build       Сборка 
npm run lint        Проверка кода линтером
npm run lint:fix    Автоматические изменения линтером 
npm test            Запуск тестов
```
## Conventional Commits
```
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