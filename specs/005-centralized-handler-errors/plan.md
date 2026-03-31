# Implementation Plan: Централизованная обработка ошибок в Telegram-хендлерах

**Branch**: `005-centralized-handler-errors` | **Date**: 2026-03-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-centralized-handler-errors/spec.md`

## Summary

Убрать дублирующуюся обработку ошибок из Telegram-хендлеров и перенести её в одну переиспользуемую обёртку, которая логирует ошибку с контекстом и пытается отправить пользователю единое fallback-сообщение. Интеграция выполняется через фабрику регистрации и отдельные хендлеры, без изменения штатного поведения бота при отсутствии ошибок.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js 18+  
**Primary Dependencies**: Telegraf 4.x, Express 5.x, better-sqlite3  
**Storage**: SQLite (`data/bot.db`) для данных бота; сама фича состояние не меняет  
**Testing**: `npm run build`; добавить `npm test` для unit-тестов обёртки и error-path сценариев; `cd admin && npm run build`; `cd admin && npm run lint`  
**Target Platform**: Linux/Node.js сервер, Telegram Bot API  
**Project Type**: Telegram бот + встроенный Express API  
**Performance Goals**: Нулевое заметное влияние на пользовательскую задержку; обработка ошибки должна завершаться одним логированием и не более одной попыткой fallback-ответа  
**Constraints**: Не менять UX при отсутствии ошибок; fallback-текст только на русском; без новых внешних зависимостей; вторичная ошибка при `ctx.reply` или `ctx.answerCbQuery` не должна ронять обработчик  
**Scale/Scope**: ~8 handler-модулей и общие утилиты обработки ответа; один новый модуль обёртки; минимальные тесты для wrapper-логики

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Принцип | Статус | Комментарий |
|---------|--------|-------------|
| I. Русскоязычный UX | ✅ PASS | Fallback-сообщение закреплено на русском языке |
| II. Контент из БД | ✅ PASS | Изменение не затрагивает источники пользовательского контента |
| III. Когерентность кеша | ✅ PASS | Нет изменений в admin API и кеше |
| IV. Целостность навигационного стека | ✅ PASS | Обёртка охватывает ошибки, не меняя push/pop логику |
| V. Минимальная сложность | ✅ PASS | Одна общая обёртка вместо новых библиотек и разнотипных helper-слоёв |
| VI. Документация на русском | ✅ PASS | План и сопутствующие артефакты ведутся на русском |
| VII. Ветвление по фичам | ✅ PASS | Работа ведётся в `005-centralized-handler-errors` |
| VIII. Асинхронный код | ✅ PASS | Дизайн сохраняет `async/await` и явный `await` для действий Telegram API |
| IX. Обязательное тестирование | ✅ PASS | План включает добавление `npm test` и unit-тестов для error-wrapper как части реализации |
| X. Линтинг | ✅ PASS | Линтинг админки остаётся в required checks; для бота отдельный линтер не настроен |
| XI. Именованные аргументы | ✅ PASS | Обёртка проектируется с объектными параметрами при >2 аргументах |
| XII. Структура модулей и обработчиков | ✅ PASS | Повторяющийся паттерн обработки ошибок выносится в переиспользуемую функцию |

### Post-Design Constitution Check

| Принцип | Статус | Комментарий |
|---------|--------|-------------|
| I. Русскоязычный UX | ✅ PASS | В контракте зафиксирован единый русский fallback-текст |
| V. Минимальная сложность | ✅ PASS | Выбрана одна wrapper-функция и точечная интеграция в текущие модули |
| IX. Обязательное тестирование | ✅ PASS | Дизайн предусматривает unit-тесты wrapper-пути и сценария вторичного сбоя fallback |
| XII. Структура модулей и обработчиков | ✅ PASS | Обработка ошибок вынесена из хендлеров в отдельный модуль без переноса бизнес-логики |

## Project Structure

### Documentation (this feature)

```text
specs/005-centralized-handler-errors/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── error-handler-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── handlers/
│   ├── admin.ts
│   ├── back.ts
│   ├── factory.ts
│   ├── fallback.ts
│   ├── groups.ts
│   ├── start.ts
│   └── types.ts
├── utils/
│   ├── utils.ts
│   ├── history.ts
│   ├── navigationStack.ts
│   └── handlers/
│       ├── withErrorHandler.ts
│       └── types.ts
├── data/
│   ├── buttonKeys.ts
│   └── buttons.ts
└── index.ts

tests/
├── unit/
│   └── utils/
│       └── handlers/
│           └── withErrorHandler.test.ts
└── integration/
    └── handlers/
        └── registration-error-flow.test.ts
```

**Structure Decision**: Остаёмся в существующей single-project структуре на базе `src/`. Новый код локализуется в `src/utils/handlers/` как инфраструктурный helper для Telegram-хендлеров; точечные изменения затрагивают `src/handlers/*` и частично `src/utils/utils.ts`. Тесты добавляются в новый `tests/` каталог, чтобы изолировать wrapper-логику от production-модулей.

## Complexity Tracking

Нарушений конституции, требующих отдельного обоснования, нет.
