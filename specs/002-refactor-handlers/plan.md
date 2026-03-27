# Implementation Plan: Рефакторинг обработчиков Telegram

**Branch**: `002-refactor-handlers` | **Date**: 2026-03-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-refactor-handlers/spec.md`

## Summary

Разбить монолитный файл `src/utils/handlers.ts` (333 строки) на 13 файлов в `src/handlers/`. Создать фабрику `registerCategory` для устранения 6+ повторяющихся блоков регистрации обработчиков. Поведение бота сохраняется без изменений.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js 18+, компиляция в `dist/` через `tsc`
**Primary Dependencies**: Telegraf 4.x — фреймворк бота; `better-sqlite3` — хранилище данных
**Storage**: N/A (рефакторинг не изменяет схему данных)
**Testing**: Ручная проверка (test-фреймворк не настроен, см. CLAUDE.md)
**Target Platform**: Node.js, один Docker-контейнер
**Project Type**: Telegram-бот (Telegraf + Express)
**Performance Goals**: N/A — pure refactor
**Constraints**: Поведение бота идентично до и после; `npm run build` должен проходить без ошибок
**Scale/Scope**: ~333 строк → ~13 файлов, каждый ≤50 строк

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Принцип | Статус | Комментарий |
|---------|--------|-------------|
| I. Русскоязычный UX | ✅ PASS | Пользовательский текст не изменяется |
| II. Контент из БД | ✅ PASS | Обращения к dataProvider не изменяются |
| III. Когерентность кеша | ✅ PASS | Нет записей через API |
| IV. Целостность навигационного стека | ✅ PASS | pushToStack/popFromStack сохраняются в фабрике |
| V. Минимальная сложность | ✅ PASS | Фабрика оправдана: 6+ мест использования; новых зависимостей нет |
| VI. Документация на русском | ✅ PASS | Все JSDoc-комментарии на русском |
| VII. Ветвление по фичам | ✅ PASS | Разработка ведётся в ветке `002-refactor-handlers` |
| VIII. Async/await | ✅ PASS | Весь новый код использует async/await |
| IX. Тестирование | ⚠️ GAP | Test-фреймворк не настроен (CLAUDE.md). Фабрика — инфраструктурный код без бизнес-логики; проверка ручная |
| X. Линтинг | ℹ️ N/A | Линтер для бота не настроен (CLAUDE.md) |
| XI. Именованные аргументы | ✅ PASS | `registerCategory` принимает объект `RegisterCategoryOptions` (4 поля) |
| XII. Структура модулей | ✅ PASS | Именно то, что реализуется: один файл — одна ответственность |

**Complexity Tracking**:

| Нарушение | Почему нужно | Более простая альтернатива отклонена |
|-----------|-------------|--------------------------------------|
| IX. Тесты отсутствуют | Test-фреймворк не настроен в проекте | Добавление jest выходит за рамки задачи (Конституция V) |

## Project Structure

### Documentation (this feature)

```text
specs/002-refactor-handlers/
├── plan.md          # This file
├── research.md      # Phase 0 output
├── data-model.md    # Phase 1 output
├── contracts/       # Phase 1 output (внутренний контракт фабрики)
└── tasks.md         # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── handlers/                   # НОВАЯ директория (заменяет utils/handlers.ts)
│   ├── index.ts                # registerAllHandlers(bot) — оркестратор
│   ├── factory.ts              # registerCategory(options) — фабрика
│   ├── start.ts                # /start + buttonKeys.start
│   ├── welcome.ts              # buttonKeys.welcome
│   ├── newbie.ts               # buttonKeys.newbie (кастомный mapper)
│   ├── participant.ts          # buttonKeys.participant (кастомный mapper)
│   ├── faq.ts                  # buttonKeys.faq
│   ├── about_aa.ts             # buttonKeys.about_aa
│   ├── relative.ts             # buttonKeys.relative (кастомный mapper)
│   ├── groups.ts               # group_schedule (статические + catch-all)
│   ├── back.ts                 # action 'back'
│   ├── admin.ts                # action 'admin_panel'
│   └── fallback.ts             # bot.on('text') + bot.on('message') + 'no_action'
├── utils/
│   ├── handlers.ts             # УДАЛИТЬ
│   ├── navigationStack.ts      # без изменений
│   ├── utils.ts                # без изменений
│   └── history.ts              # без изменений
└── index.ts                    # изменить импорт: registerButtonHandlers → registerAllHandlers
```

**Structure Decision**: Вариант "Single project" (Option 1). Новая директория `src/handlers/` заменяет монолитный файл. Каждый файл — одна ответственность. Директория `src/utils/` сохраняется для остальных утилит.
