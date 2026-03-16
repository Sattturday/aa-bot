# План: Админ-панель через Telegram Mini App

## Контекст

Бот AA сейчас хранит все данные (группы, сообщения, URL) в статических TypeScript файлах. Чтобы изменить расписание или добавить группу, нужно менять код и пересобирать Docker. Цель — сделать бот универсальным для любого региона, дав админу возможность редактировать данные через Telegram Mini App.

## Рекомендуемая архитектура: Монолит (Express + SQLite в том же процессе)

**Почему не другие варианты:**
- **JSON-файлы** — race conditions при записи, нет транзакций
- **Отдельные сервисы** — для 12 групп и 1-2 админов это over-engineering
- **Только бот-команды** — плохой UX для редактирования длинных текстов и расписаний

**Почему монолит:**
- Один процесс, один контейнер, один деплой
- SQLite — один файл, ACID, zero-config
- Express делит event loop с Telegraf
- Кэш инвалидируется простым вызовом функции (без Redis/pub-sub)

## База данных: SQLite (better-sqlite3)

```sql
CREATE TABLE groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('aa', 'alanon')),
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  map_link TEXT NOT NULL DEFAULT '',
  video_path TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  days TEXT NOT NULL,   -- JSON: '["Пн","Вт"]'
  time TEXT NOT NULL
);

CREATE TABLE messages (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE urls (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE admins (
  telegram_id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Пользователи бота (для будущей рассылки)
CREATE TABLE users (
  telegram_id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  username TEXT NOT NULL DEFAULT '',
  first_seen TEXT DEFAULT (datetime('now')),
  last_seen TEXT DEFAULT (datetime('now'))
);

-- Лог действий пользователей
CREATE TABLE user_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT NOT NULL REFERENCES users(telegram_id),
  action TEXT NOT NULL,              -- кнопка/команда
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_user_actions_telegram_id ON user_actions(telegram_id);
CREATE INDEX idx_user_actions_created_at ON user_actions(created_at);
```

## API (Express, все под /api/)

| Метод | Путь | Назначение |
|-------|------|------------|
| POST | /api/auth/validate | Валидация initData → JWT |
| GET/POST/PUT/DELETE | /api/groups[/:id] | CRUD групп |
| PUT | /api/groups/:id/schedules | Замена расписания группы |
| GET/PUT | /api/messages[/:key] | Чтение/редактирование текстов |
| GET/PUT | /api/urls[/:key] | Чтение/редактирование ссылок |
| GET/PUT | /api/settings[/:key] | Настройки (телефон, регион) |
| GET/POST/DELETE | /api/admins[/:telegram_id] | Управление админами |
| GET | /api/users | Список пользователей бота (с пагинацией) |
| GET | /api/users/:telegram_id/actions | Лог действий пользователя |
| GET | /api/stats | Статистика: кол-во пользователей, активность за период |
| POST | /api/broadcast | Отправка сообщения всем/выбранным пользователям (будущее) |

## Аутентификация

1. Админ нажимает кнопку «Админ-панель» в боте (видна только для ID из таблицы admins)
2. Бот отправляет `web_app` кнопку → открывается Mini App
3. Frontend получает `window.Telegram.WebApp.initData`
4. Отправляет на `POST /api/auth/validate`
5. Backend проверяет HMAC-SHA256 + проверяет telegram_id в таблице admins
6. Возвращает JWT (1 час), frontend хранит в памяти

## Frontend (Mini App)

**Стек:** React + Vite + Tailwind CSS + Telegram WebApp SDK

**Экраны (~6):**
1. Список групп (вкладки АА / Ал-Анон, сортировка по городу)
2. Редактор группы (форма + динамические строки расписания)
3. Редактор сообщений (список ключей с textarea)
4. Редактор URL / настроек
5. Управление админами
6. Пользователи и статистика (список пользователей, лог действий, кнопка рассылки — в будущем)

## Структура файлов (новые/изменённые)

```
src/
├── server.ts                    # Express setup, static serve
├── db/
│   ├── database.ts              # better-sqlite3 init, миграции
│   ├── seed.ts                  # Миграция из hardcoded данных
│   ├── groupsRepo.ts
│   ├── messagesRepo.ts
│   ├── urlsRepo.ts
│   ├── settingsRepo.ts
│   ├── adminsRepo.ts
│   └── usersRepo.ts            # Пользователи + лог действий
├── api/
│   ├── router.ts
│   ├── authMiddleware.ts
│   ├── authController.ts
│   ├── groupsController.ts
│   ├── messagesController.ts
│   ├── urlsController.ts
│   ├── settingsController.ts
│   ├── adminsController.ts
│   └── usersController.ts      # Просмотр пользователей и статистики
├── utils/
│   ├── handlers.ts              # Рефакторинг: repos вместо импортов
│   ├── utils.ts                 # Рефакторинг: repos вместо импортов
│   ├── telegramAuth.ts          # Валидация initData (HMAC)
│   └── cache.ts                 # Простой TTL-кэш
├── types/
│   └── index.ts                 # Общие интерфейсы
admin/                           # Vite проект (Mini App frontend)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/ (6 экранов)
│   ├── api/client.ts
│   └── hooks/useTelegram.ts
├── vite.config.ts
├── package.json
data/
└── bot.db                       # SQLite файл (Docker volume)
```

## Сохранение пользователей и статистики

Сейчас `history.ts` хранит действия in-memory и сбрасывает каждые 3 часа. Заменяем на персистентное хранение в SQLite:

- **При любом взаимодействии с ботом** (кнопка, /start, текст): upsert пользователя в таблицу `users` (обновляем `last_seen`), записываем действие в `user_actions`
- `history.ts` рефакторим: вместо in-memory объекта пишем в БД через `usersRepo`
- Отправка статистики админу каждые 3 часа — теперь формируем из БД (за последние 3 часа), данные не удаляются
- В админке: экран «Пользователи» с таблицей (имя, username, последний визит), клик → лог действий
- **Рассылка** (`POST /api/broadcast`) — пока как заглушка в API, реализуем позже. Бот будет вызывать `bot.telegram.sendMessage()` для каждого пользователя из `users`

## Кэширование данных в боте

Простой in-memory кэш с TTL (60 сек) + ручная инвалидация при записи через API. Для 12 групп и 37 сообщений — достаточно.

## Миграция данных

1. `seed.ts` читает текущие `groups.ts`, `messages.ts`, `urls.ts`
2. Вставляет в SQLite (`INSERT OR IGNORE`)
3. Запускается один раз при первом запуске
4. Старые файлы `src/data/` остаются как fallback, потом удаляются

## Изменения деплоя

- **Dockerfile:** добавить build-зависимости для better-sqlite3, multi-stage build для admin frontend
- **docker-compose.yml:** порт 3000, volume для `./data:/usr/src/app/data`, новые env vars (`WEBAPP_URL`, `JWT_SECRET`, `ADMIN_IDS`, `PORT`)
- **HTTPS:** решим позже (Mini App требует HTTPS, варианты: Caddy, Cloudflare Tunnel, nginx)

## Новые env-переменные

```
WEBAPP_URL=https://your-domain.com   # URL Mini App
JWT_SECRET=random-string             # Для подписи JWT
ADMIN_IDS=341438691                  # Начальные админы (comma-separated)
PORT=3000                            # Порт Express
```

## Порядок реализации

1. SQLite + репозитории (`src/db/`)
2. Seed-скрипт (миграция hardcoded → SQLite)
3. Рефакторинг бота (repos + кэш вместо импортов)
4. Express сервер + API роуты
5. Аутентификация (initData + JWT)
6. Admin frontend (Vite + React)
7. Кнопка «Админ-панель» в боте
8. Обновление Docker + HTTPS

## Верификация

- Шаги 1-3: `npm run dev`, бот работает как раньше, но данные из SQLite
- Шаги 4-5: `curl` запросы к API с валидным JWT
- Шаги 6-7: открыть Mini App через кнопку в боте, создать/отредактировать группу, проверить что бот показывает обновлённые данные
- Шаг 8: `docker-compose up`, проверить весь флоу в контейнере

## Критические файлы для модификации

- `src/index.ts` — добавить Express рядом с Telegraf
- `src/utils/handlers.ts` — заменить импорты данных на вызовы repos
- `src/utils/utils.ts` — то же
- `src/data/groups.ts` — источник данных для seed
- `src/data/messages.ts` — источник данных для seed
- `Dockerfile` — multi-stage build
- `docker-compose.yml` — порты, volumes, env vars
- `package.json` — новые зависимости (express, better-sqlite3, jsonwebtoken)
