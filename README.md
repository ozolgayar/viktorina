# Викторина «25 лет ГЕРОФАРМ»

Мобильное веб-приложение-викторина на Next.js + Supabase с серверной проверкой ответов и времени.

## Стек

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS 4** — стили, mobile-first
- **Supabase** — PostgreSQL, хранение сессий и вопросов
- **Vercel** — деплой

## Быстрый старт (локальное тестирование)

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Откройте **SQL Editor** и выполните скрипт `supabase/schema.sql`
3. Перейдите в **Settings → API** и скопируйте:
   - Project URL
   - `anon` public key
   - `service_role` secret key (не публикуйте!)

### 3. Переменные окружения

Скопируйте пример и заполните значения:

```bash
cp .env.local.example .env.local
```

Для локального тестирования без ограничения по времени:

```env
QUIZ_SKIP_TIME_WINDOW=true
```

Остальные переменные — из Supabase Dashboard.

### 4. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Структура приложения

```
src/
  app/
    page.tsx              — главная страница
    start/page.tsx        — регистрация (ФИО, email)
    quiz/[sessionId]/     — экран вопросов с таймером
    results/[sessionId]/  — результат
    api/
      session/start/      — создание сессии (сервер)
      session/finish/     — подсчёт результата (сервер)
      session/time/       — синхронизация таймера
      quiz/availability/  — проверка временного окна
  components/             — UI-компоненты
  lib/                    — конфиг, Supabase, утилиты
supabase/
  schema.sql              — SQL для Supabase
public/
  logo/                   — SVG-логотипы
  patterns/               — корпоративные фоны
```

## Античит

| Механизм | Реализация |
|---|---|
| Правильные ответы | `correct_index` хранится в БД, RLS блокирует доступ anon/authenticated |
| Подсчёт результата | Серверный Route Handler сверяет ответы с эталоном |
| Время начала/конца | `started_at` / `finished_at` через `now()` в PostgreSQL |
| Лимит 25 минут | Проверка на сервере по меткам БД |
| Временное окно | 10:00–17:00 МСК, проверка на сервере |

## Настройка викторины

Переменные в `.env.local`:

| Переменная | Описание | По умолчанию |
|---|---|---|
| `QUIZ_EVENT_DATE` | Дата проведения (YYYY-MM-DD) | — |
| `QUIZ_START_HOUR` | Начало окна (час) | 10 |
| `QUIZ_END_HOUR` | Конец окна (час) | 17 |
| `QUIZ_TIMEZONE` | Часовой пояс | Europe/Moscow |
| `QUIZ_TIME_LIMIT_MINUTES` | Лимит времени | 25 |
| `QUIZ_QUESTIONS_COUNT` | Количество вопросов | 10 |
| `QUIZ_SKIP_TIME_WINDOW` | Пропуск проверки времени (для тестов) | false |

## Замена вопросов

1. Откройте Supabase → **Table Editor** → `questions`
2. Удалите тестовые вопросы или отредактируйте их
3. Добавьте свои: поля `text`, `options` (JSON-массив строк), `correct_index` (0–3)

Минимум 10 вопросов в банке (рекомендуется 15+).

## Выгрузка результатов

1. Supabase → **Table Editor** → `sessions`
2. Кнопка **Export** → CSV

Столбцы: `full_name`, `email`, `started_at`, `finished_at`, `score`, `answers`.

## Деплой на Vercel

1. Загрузите проект в GitHub/GitLab/Bitbucket
2. Импортируйте репозиторий на [vercel.com](https://vercel.com)
3. В **Environment Variables** добавьте все переменные из `.env.local.example`
4. Установите `QUIZ_SKIP_TIME_WINDOW=false` для продакшена
5. Deploy

После деплоя проверьте:
- Главная страница открывается
- Регистрация создаёт сессию в Supabase
- Результат сохраняется в таблице `sessions`

## Корпоративные цвета

- Оранжевый: `#F7941D`
- Бирюзовый: `#23A790`

Логотипы: `public/logo/`, фоны: `public/patterns/`.
