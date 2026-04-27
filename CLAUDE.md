# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Development with watch mode (tsc -w + nodemon dist/index.js)
npm run build     # Compile TypeScript to dist/
npm run start     # Run compiled bot: node dist/index.js
npm run docker_build  # Build Docker image
```

Admin panel (separate React app in `admin/`):
```bash
cd admin && npm run dev    # Vite dev server
cd admin && npm run build  # Build to admin/dist/ (served by Express)
cd admin && npm run lint   # ESLint
```

No test framework is configured. No linter for the bot code.

Requires Node.js 18+. Use `nvm use 18` if needed.

Required `.env` file:
```
BOT_TOKEN=<telegram bot token>
TG_ID=<admin telegram user id>
WEBAPP_URL=<https URL for Mini App admin panel>
JWT_SECRET=<random string for JWT signing>
ADMIN_IDS=<comma-separated telegram user ids>
PORT=5000
```

## Architecture

Telegram bot (Telegraf + TypeScript + Express) for the AA community. All user-facing text is in Russian. Data is stored in SQLite (better-sqlite3), editable via Telegram Mini App admin panel.

Two separate codebases in one repo:
- **Bot** (root) — Telegraf + Express, TypeScript compiled to `dist/`
- **Admin panel** (`admin/`) — React + Vite + Tailwind, built to `admin/dist/`, served as static files by Express

### Data storage

SQLite database at `data/bot.db`. Tables: `groups`, `schedules`, `messages`, `urls`, `settings`, `admins`, `users`, `user_actions`. Data is seeded from legacy static files in `src/data/` on first run. WAL mode enabled, foreign keys enforced.

### Caching layer

`DataCache` (`src/utils/cache.ts`) wraps all DB reads for the bot with a 60s TTL. Admin API writes call `invalidate*()` functions in `dataProvider.ts` to bust the cache immediately. When modifying admin API controllers, always call the appropriate invalidation function after writes.

### Navigation model

Each user has a navigation stack in `userNavigationStack` in `index.ts`. Every button press pushes the current screen; "back" pops it. Stack is capped at 10,000 users and trimmed automatically. This is the core UX pattern.

### Navigation types

`buttonKeys` (in `src/data/buttonKeys.ts`) is the single source of truth for all screens and buttons, typed with `as const`. Three types are derived from it:
- **`ScreenKey`** — `keyof typeof buttonKeys` (e.g., `'start'`, `'welcome'`, `'newbie'`)
- **`ButtonKey`** — union of all array values in `buttonKeys` (e.g., `'want_to_quit'`, `'faq'`, `'group_12_21'`)
- **`NavKey`** — `ScreenKey | ButtonKey`

Handler types (`src/handlers/types.ts`) enforce `ScreenKey` for `category` and `readonly ButtonKey[]` for `keys`. Runtime access to `buttons[key]` remains `string`-typed due to dynamic callback data.

### Data flow

```
index.ts  →  handlers.ts  →  utils.ts
               ↓                ↓
           history.ts       db/dataProvider.ts (cached reads from SQLite)
                                ↓
                            db/*Repo.ts → database.ts (SQLite)
```

- **`src/index.ts`** — Bot + Express init, DB init, seed, stack management, stats interval.
- **`src/server.ts`** — Express app: mounts `/api` router and serves admin static files from `admin/dist/`.
- **`src/db/database.ts`** — SQLite connection, table creation.
- **`src/db/dataProvider.ts`** — Cached data accessors for bot (groups, messages, urls, settings). Caches auto-invalidate on admin API writes.
- **`src/db/*Repo.ts`** — Repository modules: `groupsRepo`, `messagesRepo`, `urlsRepo`, `settingsRepo`, `adminsRepo`, `usersRepo`.
- **`src/api/router.ts`** — Express routes for admin CRUD (auth + JWT).
- **`src/utils/handlers.ts`** — Telegraf action handlers. Group buttons are generated dynamically from DB.
- **`src/utils/utils.ts`** — Display helpers for bot messages.
- **`src/utils/history.ts`** — Tracks user actions to SQLite; sends stats to admin every 3h.
- **`src/data/`** — Legacy static data files, used only by `seed.ts` for initial migration. Navigation structure (`buttons.ts`, `buttonKeys.ts`) is still static.

### Admin API & Auth

All under `/api/`, JWT-protected (except `/api/auth/validate` and `/api/health`). Auth flow: Telegram Mini App sends `initData` → `authController` validates it using HMAC-SHA256 (5-minute window) → returns JWT (1h expiry). Only users in the `admins` table get access.

CRUD endpoints for: groups (with schedule replacement), messages, urls, settings, admins. User listing and stats.

### Adding a new group (via admin)

Groups are now managed via the admin Mini App or API. The bot dynamically reads groups from DB. Static `buttonKeys.group_schedule` is no longer the source of truth — a regex handler (`/^group_/`) catches dynamically-added groups.

### Adding a new static screen

1. Add message text via admin panel (or `src/data/messages.ts` for seed)
2. Add button layout to `src/data/buttons.ts`
3. Add button key(s) to `src/data/buttonKeys.ts`
4. Register handler(s) in `src/utils/handlers.ts`

### Key patterns

- Some message keys (e.g., `answer_11`, `alanon`, `newbie`) are dynamically computed in `dataProvider.getMessageText()` rather than stored directly — check there before assuming a message is purely DB-driven.
- `handlers.ts` imports `pushToStack`/`popFromStack` from `utils/navigationStack` (выделенный модуль стека).
- Group button keys follow the pattern `group_<slug>`. The regex catch-all `bot.action(/^group_/)` handles groups added after bot startup.

### Deployment

Docker (Node 18 slim). Needs volume mount for `data/` to persist SQLite. Port 5000 for Express. HTTPS required for Telegram Mini App.

## Recent Changes
- 004-typed-button-keys: Added TypeScript (strict mode), Node.js 18+ + Telegraf 4.x, Express 5.x
- 003-zod-api-validation: Added TypeScript (strict mode), Node.js 18+ + Express 5.x, Telegraf 4.x, better-sqlite3, zod (новая)
- 002-refactor-handlers: Added TypeScript (strict mode), Node.js 18+, компиляция в `dist/` через `tsc` + Telegraf 4.x — фреймворк бота; `better-sqlite3` — хранилище данных

## Active Technologies
- TypeScript (strict mode), Node.js 18+ + Telegraf 4.x, Express 5.x (004-typed-button-keys)
- N/A (изменения только в типах, без изменения данных) (004-typed-button-keys)
