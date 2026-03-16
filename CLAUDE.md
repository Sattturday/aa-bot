# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Development with watch mode (tsc -w + nodemon dist/index.js)
npm run build     # Compile TypeScript to dist/
npm run start     # Run compiled bot: node dist/index.js
npm run docker_build  # Build Docker image
```

Requires Node.js 18+. Use `nvm use 18` if needed.

Required `.env` file:
```
BOT_TOKEN=<telegram bot token>
TG_ID=<admin telegram user id>
WEBAPP_URL=<https URL for Mini App admin panel>
JWT_SECRET=<random string for JWT signing>
ADMIN_IDS=<comma-separated telegram user ids>
PORT=3000
```

## Architecture

Telegram bot (Telegraf + TypeScript + Express) for the AA community. All user-facing text is in Russian. Data is stored in SQLite (better-sqlite3), editable via Telegram Mini App admin panel.

### Data storage

SQLite database at `data/bot.db`. Tables: `groups`, `schedules`, `messages`, `urls`, `settings`, `admins`, `users`, `user_actions`. Data is seeded from legacy static files in `src/data/` on first run.

### Navigation model

Each user has a navigation stack in `userNavigationStack` in `index.ts`. Every button press pushes the current screen; "back" pops it. This is the core UX pattern.

### Data flow

```
index.ts  →  handlers.ts  →  utils.ts
               ↓                ↓
           history.ts       db/dataProvider.ts (cached reads from SQLite)
                                ↓
                            db/*Repo.ts → database.ts (SQLite)
```

- **`src/index.ts`** — Bot + Express init, DB init, seed, stack management, stats interval.
- **`src/server.ts`** — Express app: mounts `/api` router and serves admin static files.
- **`src/db/database.ts`** — SQLite connection, table creation.
- **`src/db/dataProvider.ts`** — Cached data accessors for bot (groups, messages, urls, settings). Caches auto-invalidate on admin API writes.
- **`src/db/*Repo.ts`** — Repository modules: `groupsRepo`, `messagesRepo`, `urlsRepo`, `settingsRepo`, `adminsRepo`, `usersRepo`.
- **`src/api/router.ts`** — Express routes for admin CRUD (auth + JWT).
- **`src/utils/handlers.ts`** — Telegraf action handlers. Group buttons are generated dynamically from DB.
- **`src/utils/utils.ts`** — Display helpers for bot messages.
- **`src/utils/history.ts`** — Tracks user actions to SQLite; sends stats to admin every 3h.
- **`src/data/`** — Legacy static data files, used only by `seed.ts` for initial migration. Navigation structure (`buttons.ts`, `buttonKeys.ts`) is still static.

### Admin API

All under `/api/`, JWT-protected (except `/api/auth/validate`). CRUD for groups, messages, urls, settings, admins. User listing and stats.

### Adding a new group (via admin)

Groups are now managed via the admin Mini App or API. The bot dynamically reads groups from DB. Static `buttonKeys.group_schedule` is no longer the source of truth — a regex handler (`/^group_/`) catches dynamically-added groups.

### Adding a new static screen

1. Add message text via admin panel (or `src/data/messages.ts` for seed)
2. Add button layout to `src/data/buttons.ts`
3. Add button key(s) to `src/data/buttonKeys.ts`
4. Register handler(s) in `src/utils/handlers.ts`

### Deployment

Docker (Node 18 slim). Needs volume mount for `data/` to persist SQLite. Port 3000 for Express. HTTPS required for Telegram Mini App.
