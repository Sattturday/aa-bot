# Repository Guidelines

## Project Structure & Module Organization
- `src/`: Telegram bot, Express API, SQLite access, handlers, and shared utilities.
- `admin/src/`: React + Vite Telegram Mini App for editing bot data.
- `src/db/`: database setup, seed logic, repositories, and cache invalidation hooks.
- `src/api/`: admin API controllers, router, auth middleware, and Zod validation schemas.
- `src/data/`: legacy seed data and static navigation definitions.
- `docs/`, `specs/`: design notes and implementation plans.
- `data/`: runtime SQLite files such as `data/bot.db`.

## Build, Test, and Development Commands
- `npm run dev`: watch and rebuild the bot, then restart `dist/index.js`.
- `npm run build`: compile the root TypeScript app to `dist/`.
- `npm run start`: run the compiled bot and Express server.
- `npm run docker_build`: build the production Docker image.
- `cd admin && npm run dev`: start the admin panel with Vite.
- `cd admin && npm run build`: type-check and build the admin panel to `admin/dist/`.
- `cd admin && npm run lint`: run ESLint for the admin app.

## Coding Style & Naming Conventions
Use TypeScript throughout and keep `strict`-mode compatibility intact. Follow the existing 2-space indentation style, semicolons in the bot code, and camelCase for variables and functions. Use PascalCase for React components (`GroupsList.tsx`) and `*Controller.ts`, `*Repo.ts`, `*Schema.ts` suffixes. Keep user-facing bot text in Russian unless a feature requires otherwise.

## Testing Guidelines
There is currently no automated test suite in the root app or `admin/`. Until one is added, treat these checks as required before opening a PR:

- `npm run build`
- `cd admin && npm run build`
- `cd admin && npm run lint`

When adding tests, place them near the code they cover or under `tests/`, using `*.test.ts` / `*.test.tsx`.

## Commit & Pull Request Guidelines
Recent history uses concise conventional commits such as `feat: ...`, `docs: ...`, plus merge commits referencing spec IDs like `003-zod-api-validation`. Keep each commit scoped to one change.

PRs should include:

- a short summary of user-visible or architectural impact
- linked issue or spec folder when applicable
- notes about new env vars, database changes, or cache invalidation
- screenshots for `admin/` UI changes

## Security & Configuration Tips
Do not commit `.env`, database files, or Telegram credentials. Root setup expects `BOT_TOKEN`, `TG_ID`, `WEBAPP_URL`, `JWT_SECRET`, `ADMIN_IDS`, and optional `PORT`. The Mini App requires HTTPS in production, and API writes should invalidate cached reads through `src/db/dataProvider.ts`.

## Active Technologies
- TypeScript (strict mode), Node.js 18+ + Telegraf 4.x, Express 5.x, better-sqlite3 (005-centralized-handler-errors)
- SQLite (`data/bot.db`) для данных бота; сама фича состояние не меняет (005-centralized-handler-errors)
- TypeScript (strict mode), Node.js 18+ + Telegraf 4.x, Express 5.x, better-sqlite3, Zod 4.x (без новых зависимостей) (008-centralize-i18n-texts)
- SQLite (`data/bot.db`) через `src/db/messagesRepo.ts`/`src/db/dataProvider.ts`; локальный i18n-каталог в коде как fallback (008-centralize-i18n-texts)

## Recent Changes
- 005-centralized-handler-errors: Added TypeScript (strict mode), Node.js 18+ + Telegraf 4.x, Express 5.x, better-sqlite3
