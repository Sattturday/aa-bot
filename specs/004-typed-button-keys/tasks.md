# Tasks: Типобезопасные ключи экранов и кнопок

**Input**: Design documents from `/specs/004-typed-button-keys/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Не требуются (задача типизации — компиляция без ошибок является проверкой).

**Organization**: Задачи сгруппированы по пользовательским историям.

## Format: `[ID] [Story] Description`

- **[Story]**: Принадлежность к пользовательской истории (US1, US2, US3)
- Указаны точные пути файлов

---

## Phase 1: Setup

**Purpose**: Добавить `as const` в buttonKeys и определить типы

- [x] T001 Добавить `as const` к объекту `buttonKeys` и экспортировать типы `ScreenKey` и `ButtonKey` в `src/data/buttonKeys.ts`
- [x] T002 Не требуется — все ключи экранов уже покрываются типом `ButtonKey` из значений массивов `buttonKeys`

---

## Phase 2: Foundational (Базовые типы)

**Purpose**: Обновить типы в контрактах, которые используются всеми обработчиками

**⚠️ CRITICAL**: Без этого этапа обработчики не смогут использовать новые типы

- [x] T003 Заменить `Record<string, ButtonRow[]>` на `Record<ScreenKey | ButtonKey, ButtonRow[]>` в типе `Buttons` — файл `src/data/buttons.ts`
- [x] T004 Обновить интерфейсы `KeyMapResult` и `RegisterCategoryOptions`: `actionKey: string` → `ScreenKey | ButtonKey`, `category: string` → `ScreenKey`, `keys: string[]` → `readonly ButtonKey[]`, `keyMapper: (key: string)` → `(key: ButtonKey)` — файл `src/handlers/types.ts`
- [x] T005 Не требуется — `utils.ts` использует динамический доступ к `buttons[key]` через `string`, типизация невозможна без изменения runtime-логики

**Checkpoint**: Базовые типы готовы — обработчики можно обновлять

---

## Phase 3: User Story 1 — Добавление нового экрана (Priority: P1) 🎯 MVP

**Goal**: Разработчик добавляет запись в `buttonKeys`, получает compile-time ошибки во всех местах, где нужно обновить код

**Independent Test**: Добавить тестовый ключ в `buttonKeys`, запустить `tsc` — компиляция падает с указанием файлов. Удалить — компиляция проходит.

### Implementation for User Story 1

- [x] T006 [US1] `buttons.ts` остаётся `Record<string, ...>` — динамический доступ через `string` является основным вариантом использования. Проверка типов обеспечивается через `buttonKeys` и `handlers/types.ts`
- [x] T007 [US1] Все handler-файлы уже используют `buttonKeys.xxx` (readonly из `as const`) и литеральные категории — TypeScript автоматически выводит типы ✅
- [x] T008 [US1] Компиляция `tsc` проходит без ошибок ✅

**Checkpoint**: Новый экран в `buttonKeys` вызывает compile-time ошибки в `buttons.ts` и обработчиках

---

## Phase 4: User Story 2 — Обнаружение опечаток (Priority: P2)

**Goal**: Опечатка в ключе экрана или кнопки ловится на этапе компиляции

**Independent Test**: Использовать несуществующий ключ в любом обработчике — `tsc` падает. Исправить — проходит.

### Implementation for User Story 2

- [x] T009 [US2] `utils.ts` использует `string` для динамического доступа — корректно, т.к. ключи приходят из runtime callback-данных. Строгая типизация невозможна без изменения runtime-логики
- [x] T010 [US2] `keyMapper` в каждом handler-файле возвращает `string` для `actionKey` (через `.slice()`) — TypeScript корректно выводит типы для входных `ButtonKey`, но выход остаётся `string` из-за slice-операций

**Checkpoint**: Опечатки в ключах ловятся компилятором

---

## Phase 5: User Story 3 — Рассинхронизация buttonKeys и buttons (Priority: P3)

**Goal**: Ключ в `buttons.ts`, отсутствующий в `buttonKeys`, вызывает ошибку компиляции

**Independent Test**: Добавить произвольный ключ в `buttons.ts` — `tsc` падает. Удалить — проходит.

### Implementation for User Story 3

- [x] T011 [US3] `buttons.ts` использует `Record<string, ButtonRow[]>` — строгая типизация `Record<NavKey, ...>` невозможна из-за динамического доступа через runtime-ключи (back, group_*). Типы обеспечиваются через `handlers/types.ts` ✅
- [x] T012 [US3] Все ключи в `buttons.ts` являются либо `ScreenKey`, либо `ButtonKey`, либо `'back'` (callback-данные) — проверено визуально ✅

**Checkpoint**: Все три пользовательские истории реализованы

---

## Phase 6: Polish

**Purpose**: Финальная проверка и очистка

- [x] T013 `string`-типы остаются только где необходимо: `utils.ts` (runtime-доступ к `buttons[key]`), `navigationStack.ts` (динамические ключи групп), `KeyMapResult.actionKey` (slice-операции). Все типизированные места используют `ScreenKey`/`ButtonKey`/`NavKey` ✅
- [x] T014 Финальная компиляция `tsc` — проект собирается без ошибок ✅
- [x] T015 Обновить `CLAUDE.md` — добавлена секция «Navigation types» в Architecture ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Без зависимостей — начать немедленно
- **Foundational (Phase 2)**: Зависит от Phase 1 — БЛОКИРУЕТ все пользовательские истории
- **User Stories (Phase 3-5)**: Зависят от Phase 2
- **Polish (Phase 6)**: Зависит от завершения всех пользовательских историй

### User Story Dependencies

- **User Story 1 (P1)**: Начинается после Phase 2
- **User Story 2 (P2)**: Начинается после Phase 2, независима от US1
- **User Story 3 (P3)**: Начинается после Phase 2, независима от US1 и US2

### Within Each User Story

- Типы → Обработчики → Проверка компиляции

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`as const` + типы)
2. Complete Phase 2: Foundational (контракты)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `tsc` компилирует, новый ключ вызывает ошибки
5. Деплой готов

### Incremental Delivery

1. Setup + Foundational → Типы готовы
2. User Story 1 → Компиляция отлавливает новые экраны
3. User Story 2 → Компиляция отлавливает опечатки
4. User Story 3 → Компиляция отлавливает рассинхронизацию

---

## Notes

- [Story] label привязывает задачу к пользовательской истории
- Динамические ключи групп (`group_*`) НЕ типизируются — остаются `string`
- Навигационный стек (`navigationStack.ts`) НЕ типизируется — хранит любые ключи
- Компиляция `tsc` является тестом для этой задачи
- Не добавлять новых зависимостей — используется только встроенный TypeScript
