# Implementation Plan: Централизация текстов через i18n-слой

**Branch**: `008-centralize-i18n-texts` | **Date**: 2026-04-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-centralize-i18n-texts/spec.md`

## Summary

Ввести единый слой получения текстов `t(key)`, убрать пользовательские строки из `handlers`/`utils`, обеспечить типобезопасность ключей и безопасный fallback при отсутствии значения. Источник текстов проектируется как композиция: чтение из runtime-данных (БД через существующий провайдер) с локальным словарём как гарантированным запасным вариантом, чтобы сохранить текущий UX и соответствовать конституции по хранению контента.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js 18+  
**Primary Dependencies**: Telegraf 4.x, Express 5.x, better-sqlite3, Zod 4.x (без новых зависимостей)  
**Storage**: SQLite (`data/bot.db`) через `src/db/messagesRepo.ts`/`src/db/dataProvider.ts`; локальный i18n-каталог в коде как fallback  
**Testing**: `npm test`, `npm run build`, `cd admin && npm run build`, `cd admin && npm run lint`  
**Target Platform**: Linux/Node.js сервер, Telegram Bot API  
**Project Type**: Telegram bot + встроенный Express admin API + React mini app  
**Performance Goals**: Разрешение текста через `t(key)` добавляет не более одного lookup в объект/кэш и не даёт заметной деградации отклика сообщений  
**Constraints**: Русскоязычный UX; без регрессии сценариев `/start` и навигации; без новых i18n-библиотек; единый fallback и диагностическое логирование пропусков ключей  
**Scale/Scope**: Миграция всех пользовательских строк в `src/handlers/*` и `src/utils/utils.ts`; новый модуль `src/i18n/*`; точечная адаптация `src/db/dataProvider.ts`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Принцип | Статус | Комментарий |
|---------|--------|-------------|
| I. Русскоязычный UX | ✅ PASS | Все тексты и fallback в i18n-каталоге фиксируются на русском |
| II. Контент из БД | ✅ PASS | Дизайн оставляет БД-путь источником runtime-значений, кодовый каталог используется как fallback/дефолт |
| III. Когерентность кеша | ✅ PASS | Записи через `messagesController` сохраняют `invalidateMessages()` и мгновенно влияют на чтение |
| IV. Целостность навигационного стека | ✅ PASS | Фича меняет только источник текстов, не меняет push/pop навигации |
| V. Минимальная сложность | ✅ PASS | Один модуль `i18n` без внешних библиотек и без лишних абстракций |
| VI. Документация на русском | ✅ PASS | Артефакты планирования ведутся на русском |
| VII. Ветвление по фичам | ✅ PASS | Работа ведётся в `008-centralize-i18n-texts` |
| VIII. Асинхронный код | ✅ PASS | Новые async-участки не добавляются; используется текущий async-поток хендлеров |
| IX. Обязательное тестирование | ✅ PASS | План включает `npm test` + build/lint проверки из репозитория |
| X. Линтинг | ✅ PASS | Сохраняются обязательные проверки `cd admin && npm run lint` |
| XI. Именованные аргументы | ✅ PASS | Новый публичный API ограничен `t(key)` и не вводит сигнатуры с >2 позиционными аргументами |
| XII. Структура модулей и обработчиков | ✅ PASS | Хендлеры остаются тонкими; текстовая логика выносится в отдельный слой |

### Post-Design Constitution Check

| Принцип | Статус | Комментарий |
|---------|--------|-------------|
| II. Контент из БД | ✅ PASS | Контракт `Text Resolver` фиксирует порядок: runtime override из БД, затем локальный fallback |
| V. Минимальная сложность | ✅ PASS | Выбран один резолвер `t(key)` и словарь ключей без внедрения framework-level i18n |
| IX. Обязательное тестирование | ✅ PASS | Quickstart включает `npm test` и сценарий проверки fallback/missing key |
| XII. Структура модулей и обработчиков | ✅ PASS | Перенос строк выполняется без переноса бизнес-логики в хендлеры |

## Project Structure

### Documentation (this feature)

```text
specs/008-centralize-i18n-texts/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── i18n-text-resolver-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── i18n/
│   ├── messages.ts
│   ├── types.ts
│   └── index.ts
├── handlers/
│   ├── start.ts
│   ├── admin.ts
│   ├── fallback.ts
│   ├── groups.ts
│   ├── newbie.ts
│   ├── participant.ts
│   ├── relative.ts
│   ├── about_aa.ts
│   ├── faq.ts
│   └── welcome.ts
├── utils/
│   └── utils.ts
├── db/
│   ├── dataProvider.ts
│   ├── messagesRepo.ts
│   └── seed.ts
└── data/
    └── messages.ts

tests/
├── unit/
│   └── i18n/
│       └── t.test.ts
└── integration/
    └── handlers/
        └── i18n-message-flow.test.ts
```

**Structure Decision**: Используется текущая single-project структура. Новый слой локализуется в `src/i18n/`; существующие `handlers` и `utils` переводятся на `t(key)` без изменения их ответственности. Доступ к данным сообщений остаётся через текущий слой `db/dataProvider`, чтобы не ломать админ-редактирование через БД.

## Complexity Tracking

Нарушений конституции, требующих отдельного обоснования, нет.
