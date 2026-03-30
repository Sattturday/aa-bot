# Implementation Plan: Типобезопасные ключи экранов и кнопок

**Branch**: `004-typed-button-keys` | **Date**: 2026-03-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-typed-button-keys/spec.md`

## Summary

Добавить строгую типизацию `ScreenKey` и `ButtonKey` через `as const` на `buttonKeys` и indexed access types. Заменить все `string`-типы для навигационных ключей на литеральные объединения, чтобы опечатки и рассинхронизация ловились на этапе компиляции.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js 18+
**Primary Dependencies**: Telegraf 4.x, Express 5.x
**Storage**: N/A (изменения только в типах, без изменения данных)
**Testing**: Не настроено (по конституции IX — не требуется для задачи типизации)
**Target Platform**: Node.js сервер (Telegram бот)
**Project Type**: Telegram бот + Express API
**Performance Goals**: N/A (изменения только compile-time)
**Constraints**: Не менять runtime-поведение; динамические ключи групп остаются `string`
**Scale/Scope**: ~10 файлов затронуто (buttonKeys, buttons, handlers/*, utils, navigationStack, factory, types)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Принцип | Статус | Комментарий |
|---------|--------|-------------|
| I. Русскоязычный UX | ✅ PASS | Не затрагивает пользовательский текст |
| II. Контент из БД | ✅ PASS | Не затрагивает работу с данными |
| III. Когерентность кеша | ✅ PASS | Не затрагивает кеширование |
| IV. Целостность навигационного стека | ✅ PASS | Стек работает с `string`, типизация совместима |
| V. Минимальная сложность | ✅ PASS | Никаких новых зависимостей; типы выводятся из `as const` — встроенная возможность TypeScript |
| VI. Документация на русском | ✅ PASS | Документация будет на русском |
| VII. Ветвление по фичам | ✅ PASS | Ветка `004-typed-button-keys` создана |
| VIII. Асинхронный код | ✅ PASS | Не затрагивает async/await |
| IX. Обязательное тестирование | ✅ PASS | Тестирование — компиляция без ошибок |
| X. Линтинг | ✅ PASS | Линтер не настроен для бота |
| XI. Именованные аргументы | ✅ PASS | Не добавляет функций с >2 параметрами |
| XII. Структура модулей | ✅ PASS | Не добавляет бизнес-логику в обработчики |

## Project Structure

### Documentation (this feature)

```text
specs/004-typed-button-keys/
├── plan.md              # Этот файл
├── research.md          # Phase 0: исследование
├── data-model.md        # Phase 1: модель данных (типы)
├── contracts/           # Phase 1: контракты
└── tasks.md             # Phase 2: задачи (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── data/
│   ├── buttonKeys.ts        # Основной файл — добавить `as const`
│   └── buttons.ts           # Замена Record<string, ...> на Record<ScreenKey | ButtonKey, ...>
├── handlers/
│   ├── types.ts             # Обновить интерфейсы (string → ScreenKey/ButtonKey)
│   ├── factory.ts           # Обновить типы параметров
│   ├── start.ts             # Без изменений (category как литерал)
│   ├── welcome.ts           # Без изменений
│   ├── newbie.ts            # Без изменений
│   ├── faq.ts               # Без изменений
│   ├── participant.ts       # Без изменений
│   ├── relative.ts          # Без изменений
│   ├── about_aa.ts          # Без изменений
│   ├── groups.ts            # Ключи групп — остаются string
│   └── ...
├── utils/
│   ├── utils.ts             # key: string → ScreenKey в handleButtonAction
│   └── navigationStack.ts   # state: string → ScreenKey в pushToStack
└── types/
    └── index.ts             # (если есть) — добавить ScreenKey, ButtonKey
```

**Structure Decision**: Типы `ScreenKey` и `ButtonKey` определяются рядом с `buttonKeys.ts` (или экспортируются из него), так как это единственный источник истины.

## Complexity Tracking

Нет нарушений конституции — таблица не требуется.
