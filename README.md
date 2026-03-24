# Hackathon Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
