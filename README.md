# AA Bot

Telegram-бот и административная панель для сообщества "Анонимные Алкоголики".

Проект состоит из четырёх частей:

- Telegram-бот на `Telegraf`
- backend API на `Express`
- SQLite-хранилище на `better-sqlite3`
- Telegram Mini App для администрирования контента и справочников

## Что умеет проект

### Telegram-бот

- показывает стартовое меню и сценарии для:
  - новичков
  - участников сообщества
  - родственников
- ведёт по веткам FAQ, информации об АА и расписанию групп
- показывает динамический список групп из базы данных
- поддерживает кнопку "Назад" через навигационный стек
- логирует действия пользователей и периодически отправляет статистику администратору
- использует единый error handler для Telegram-хендлеров

### Админка

Telegram Mini App позволяет:

- управлять группами АА и Ал-Анон
- редактировать тексты сообщений бота
- редактировать ссылки и настройки
- управлять списком администраторов
- смотреть пользователей, их действия и статистику

### Backend API

API обслуживает админку и включает:

- JWT-аутентификацию через Telegram WebApp `initData`
- CRUD для групп
- обновление расписаний групп
- редактирование сообщений, ссылок и настроек
- управление администраторами
- просмотр пользователей и статистики
- валидацию входных данных через `zod`

## Технологии

- Node.js 18+
- TypeScript
- Telegraf 4
- Express 5
- SQLite + `better-sqlite3`
- React 19 + Vite
- Telegram WebApp / Mini App

## Структура проекта

```text
src/           bot, API, база данных, handlers и shared utilities
admin/         React Mini App для администрирования
data/          runtime SQLite файлы
docs/          заметки и документация
specs/         feature specs и планы
tests/         unit и integration тесты
```

## Переменные окружения

Создайте `.env` в корне проекта:

```env
BOT_TOKEN=your_telegram_bot_token
TG_ID=your_telegram_id
ADMIN_IDS=123456789,987654321
JWT_SECRET=strong_secret
WEBAPP_URL=https://your-domain.example
PORT=3000
```

Описание:

- `BOT_TOKEN` — токен бота от BotFather
- `TG_ID` — Telegram ID основного администратора; ему бот отправляет уведомление о запуске и статистику
- `ADMIN_IDS` — дополнительные Telegram ID администраторов через запятую
- `JWT_SECRET` — секрет для подписи JWT токенов API
- `WEBAPP_URL` — публичный URL Mini App, который открывается из Telegram
- `PORT` — порт HTTP-сервера, по умолчанию `3000`

## Установка

```bash
git clone https://github.com/Sattturday/aa-bot.git
cd aa-bot
npm install
cd admin && npm install && cd ..
```

## Разработка

### Бот и backend

```bash
npm run dev
```

Команда запускает TypeScript в watch-режиме и перезапускает `dist/index.js`.

### Админка

```bash
cd admin
npm run dev
```

### Production build

```bash
npm run build
cd admin && npm run build
```

### Запуск production-сборки

```bash
npm run start
```

Express-сервер:

- обслуживает API по префиксу `/api`
- раздаёт собранную админку из `admin/dist`
- использует SPA fallback для Mini App

## Основные API endpoints

Публичные:

- `POST /api/auth/validate`
- `GET /api/health`

Под JWT:

- `GET/POST/PUT/DELETE /api/groups`
- `PUT /api/groups/:id/schedules`
- `GET/PUT /api/messages`
- `GET/PUT /api/urls`
- `GET/PUT /api/settings`
- `GET/POST/DELETE /api/admins`
- `GET /api/users`
- `GET /api/users/:telegram_id/actions`
- `GET /api/stats`

## Данные

SQLite база хранится в `data/bot.db`.

В базе поддерживаются:

- группы и их расписания
- тексты сообщений бота
- ссылки
- настройки
- администраторы
- пользователи
- история действий пользователей

При первом запуске приложение:

- инициализирует схему БД
- сидирует базовые данные
- добавляет администраторов из `ADMIN_IDS`
- всегда добавляет `TG_ID` как администратора

## Тесты и проверки

```bash
npm test
npm run build
cd admin && npm run build
cd admin && npm run lint
```

Сейчас в проекте есть automated tests для:

- Telegram handler error flow
- auth middleware и auth controller
- validation middleware и Zod-схем
- router wiring
- utility-модулей вроде `navigationStack`, `slugify`, `telegramAuth`

## Docker

Для сборки Docker-образа:

```bash
npm run docker_build
```

## Примечания

- Mini App в production должен открываться по HTTPS
- если `admin/dist` не собран, сервер вернёт сообщение `Admin panel not built yet`
- пользовательские тексты в боте ориентированы на русский язык
