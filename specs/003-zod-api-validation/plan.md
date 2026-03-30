# Implementation Plan: Валидация API через Zod

**Branch**: `003-zod-api-validation` | **Date**: 2026-03-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-zod-api-validation/spec.md`

## Summary

Добавить схемную валидацию входных данных для всех API-эндпоинтов, принимающих тело запроса. Создать папку `src/api/validation/` с 6 схемами и middleware `validateBody`. Применить middleware в `router.ts`. Удалить ручные проверки из контроллеров.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js 18+
**Primary Dependencies**: Express 5.x, Telegraf 4.x, better-sqlite3, zod (новая)
**Storage**: SQLite via better-sqlite3 (не затронуто)
**Testing**: `npm test` после каждого изменения
**Target Platform**: Linux server (Docker, один контейнер)
**Project Type**: web-service (Express API + Telegram bot)
**Performance Goals**: стандартные (валидация добавляет <1ms накладных расходов)
**Constraints**: один Docker-контейнер, синхронный SQLite API
**Scale/Scope**: ~7 эндпоинтов с телом запроса, 5 контроллеров

## Constitution Check

*GATE: Проверено до Phase 0.*

| Принцип | Статус | Комментарий |
|---------|--------|-------------|
| I. Русскоязычный UX | ✅ PASS | Изменения в API-слое, не в боте |
| II. Контент из БД | ✅ PASS | Не затронуто |
| III. Когерентность кеша | ✅ PASS | Валидация до записи, инвалидация остаётся в контроллерах |
| IV. Навигационный стек | ✅ PASS | Не затронуто |
| V. Минимальная сложность | ✅ PASS | Zod: 6+ мест использования (обоснована). `validateBody`: 6+ роутов (обоснована) |
| VI. Документация на русском | ✅ PASS | Docstrings будут на русском |
| VII. Ветвление по фичам | ✅ PASS | Ветка `003-zod-api-validation` создана |
| VIII. Асинхронный код | ✅ PASS | Middleware синхронный (валидация) — допустимо |
| IX. Обязательное тестирование | ✅ PASS | Тесты middleware и схем запланированы |
| X. Линтинг | ✅ PASS | Линтер для бота не настроен; admin: `cd admin && npm run lint` |
| XI. Именованные аргументы | ✅ PASS | `validateBody(schema)` — 1 параметр, проблем нет |
| XII. Структура модулей | ✅ PASS | Контроллеры очищаются от валидационной логики |

## Project Structure

### Documentation (this feature)

```text
specs/003-zod-api-validation/
├── plan.md         # Этот файл
├── research.md     # Phase 0 output
├── data-model.md   # Phase 1 output
├── contracts/      # Phase 1 output
└── tasks.md        # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
└── api/
    ├── validation/             (NEW)
    │   ├── validateBody.ts     (middleware-фабрика)
    │   ├── groupSchema.ts      (схема для createGroup)
    │   ├── groupUpdateSchema.ts (схема для updateGroup — partial)
    │   ├── messageSchema.ts    (схема для updateMessage)
    │   ├── urlSchema.ts        (схема для updateUrl)
    │   ├── settingSchema.ts    (схема для updateSetting)
    │   └── adminSchema.ts      (схема для addAdmin)
    ├── groupsController.ts     (ИЗМЕНЁН — удалена ручная валидация)
    ├── messagesController.ts   (ИЗМЕНЁН — удалена ручная валидация)
    ├── urlsController.ts       (ИЗМЕНЁН — удалена ручная валидация)
    ├── settingsController.ts   (ИЗМЕНЁН — удалена ручная валидация)
    ├── adminsController.ts     (ИЗМЕНЁН — удалена ручная валидация)
    └── router.ts               (ИЗМЕНЁН — добавлен validateBody в маршруты)
```

**Structure Decision**: Все схемы и middleware изолированы в `src/api/validation/`. Один middleware `validateBody` параметризуется схемой. Контроллеры остаются в `src/api/`, router обновляется для подключения валидации.
