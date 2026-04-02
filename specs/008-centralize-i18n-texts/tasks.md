# Tasks: Централизация текстов через i18n-слой

**Input**: Design documents from `/specs/008-centralize-i18n-texts/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Требуются. В спецификации и плане есть явные критерии проверяемости, плюс конституция требует запускать `npm test`.

**Organization**: Задачи сгруппированы по пользовательским историям, чтобы каждая история реализовывалась и проверялась независимо.

## Format: `[ID] [Story] Description`

- **[Story]**: Принадлежность к пользовательской истории (`US1`, `US2`, `US3`)
- Каждая задача содержит точные пути файлов

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Подготовить каркас i18n-модуля и тестовые файлы для поэтапной миграции

- [x] T001 Создать каркас i18n-модуля в `src/i18n/messages.ts`, `src/i18n/types.ts`, `src/i18n/index.ts`
- [x] T002 Подготовить тестовые заготовки резолвера в `tests/unit/i18n/t.test.ts` и `tests/integration/handlers/i18n-message-flow.test.ts`
- [x] T003 Зафиксировать карту миграции ключей и точек использования в `specs/008-centralize-i18n-texts/quickstart.md` и `specs/008-centralize-i18n-texts/contracts/i18n-text-resolver-contract.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Реализовать базовый резолвер и инфраструктуру доступа к runtime-текстам

**⚠️ CRITICAL**: Ни одна пользовательская история не должна начинаться до завершения этого этапа

- [x] T004 Реализовать служебные типы ключей (`DeepKeys`, `MessageKey`) в `src/i18n/types.ts`
- [x] T005 Реализовать локальный каталог сообщений и группировку ключей в `src/i18n/messages.ts`
- [x] T006 Реализовать API чтения runtime-карты сообщений для i18n в `src/db/dataProvider.ts`
- [x] T007 Реализовать резолвер `t(key)` с приоритетом runtime→catalog в `src/i18n/index.ts`
- [x] T008 Подключить логирование и safe fallback (возврат ключа) в `src/i18n/index.ts`
- [x] T009 Добавить unit-тесты базового контракта резолвера в `tests/unit/i18n/t.test.ts`

**Checkpoint**: Базовый i18n-слой готов, можно мигрировать пользовательские сценарии

---

## Phase 3: User Story 1 - Единая точка доступа к текстам (Priority: P1) 🎯 MVP

**Goal**: Все пользовательские тексты в handlers/utils получают значения через `t(key)` вместо локального хардкода

**Independent Test**: Пройти `/start` и ключевые кнопки, убедиться, что сообщения берутся через i18n-слой и поведение не изменилось.

### Tests for User Story 1

- [x] T010 [US1] Добавить интеграционный сценарий для `/start` и базовой навигации через i18n в `tests/integration/handlers/i18n-message-flow.test.ts`

### Implementation for User Story 1

- [x] T011 [US1] Перевести приветственное и навигационные сообщения на `t(key)` в `src/utils/utils.ts`
- [x] T012 [P] [US1] Перевести тексты `/start` на `t(key)` в `src/handlers/start.ts`
- [x] T013 [P] [US1] Перевести тексты админ-хендлера на `t(key)` в `src/handlers/admin.ts`
- [x] T014 [P] [US1] Перевести тексты fallback-хендлера на `t(key)` в `src/handlers/fallback.ts`
- [x] T015 [US1] Обновить путь рендера сообщений для action-хендлеров через `t(key)` в `src/utils/utils.ts` и `src/handlers/factory.ts`
- [x] T016 [US1] Синхронизировать исходные тексты между `src/data/messages.ts` и `src/i18n/messages.ts` с сохранением динамических сценариев в `src/db/dataProvider.ts`

**Checkpoint**: User Story 1 полностью функциональна и даёт MVP по централизации текстов

---

## Phase 4: User Story 2 - Защита от ошибок в ключах (Priority: P2)

**Goal**: Невалидные ключи сообщений обнаруживаются на этапе проверки проекта

**Independent Test**: Добавить обращение к несуществующему ключу и убедиться, что проверка проекта падает до запуска.

### Tests for User Story 2

- [x] T017 [US2] Добавить compile-time проверки ключей и `@ts-expect-error` кейсы в `tests/unit/i18n/t.test.ts`

### Implementation for User Story 2

- [x] T018 [US2] Ужесточить сигнатуру `t(key)` до `MessageKey` и убрать небезопасные перегрузки в `src/i18n/index.ts`
- [x] T019 [US2] Обновить использование ключей в `src/utils/utils.ts`, `src/handlers/start.ts`, `src/handlers/admin.ts`, `src/handlers/fallback.ts`
- [x] T020 [US2] Выравнять типы action/message ключей в `src/handlers/factory.ts` и `src/data/buttonKeys.ts` для совместимости с `MessageKey`
- [x] T021 [US2] Добавить проверку сборки на типовые ошибки ключей в `package.json` и `tsconfig.test.json`

**Checkpoint**: Ошибки в ключах ловятся на compile-time, а валидные вызовы проходят без регрессии

---

## Phase 5: User Story 3 - Безопасное поведение при неполных данных (Priority: P3)

**Goal**: При отсутствии или пустом значении система возвращает безопасный fallback и пишет диагностику

**Independent Test**: Смоделировать отсутствующее/пустое значение ключа и проверить fallback-ответ и лог.

### Tests for User Story 3

- [x] T022 [US3] Расширить unit-тесты на missing/empty runtime значения и формат диагностики в `tests/unit/i18n/t.test.ts`
- [x] T023 [US3] Добавить integration-тест сценария forced missing key в `tests/integration/handlers/i18n-message-flow.test.ts`

### Implementation for User Story 3

- [x] T024 [US3] Реализовать единый формат fallback-логирования в `src/i18n/index.ts`
- [x] T025 [US3] Нормализовать обработку пустых runtime-значений в `src/db/dataProvider.ts`
- [x] T026 [US3] Перевести пользовательские fallback-сообщения «группа не найдена» и аналогичные на i18n-safe ключи в `src/utils/utils.ts` и `src/handlers/fallback.ts`

**Checkpoint**: Missing/empty значения не ломают UX и всегда оставляют диагностический след

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Финальная проверка качества и документации по всем историям

- [x] T027 Обновить итоговые инструкции и проверочные шаги в `specs/008-centralize-i18n-texts/quickstart.md`
- [x] T028 Выполнить и зафиксировать результат команд `npm test`, `npm run build`, `cd admin && npm run build`, `cd admin && npm run lint` в `specs/008-centralize-i18n-texts/quickstart.md`
- [x] T029 Удалить устаревшие точки прямого текстового доступа и неиспользуемые импорты в `src/db/dataProvider.ts`, `src/data/messages.ts`, `src/utils/utils.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: можно начать сразу
- **Foundational (Phase 2)**: зависит от Setup и блокирует все пользовательские истории
- **US1 (Phase 3)**: зависит от завершения Foundational
- **US2 (Phase 4)**: зависит от Foundational и логически продолжает US1
- **US3 (Phase 5)**: зависит от Foundational; рекомендуется после US1/US2, чтобы fallback покрывал финальные call sites
- **Polish (Phase 6)**: после завершения выбранных пользовательских историй

### User Story Dependencies

- **US1 (P1)**: не зависит от других историй и формирует MVP
- **US2 (P2)**: опирается на i18n API из Foundational и обновлённые call sites US1
- **US3 (P3)**: опирается на финальную схему резолвера и миграцию call sites

### Within Each User Story

- Сначала тесты соответствующей истории
- Затем реализация и миграция call sites
- Затем локальная проверка независимого acceptance-сценария истории

## Parallel Execution Opportunities

### User Story 1

- T012, T013 и T014 можно выполнять параллельно после T011

### User Story 2

- T019 и T020 можно выполнять параллельно после T018

### User Story 3

- T024 и T025 можно выполнять параллельно после T022

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Завершить Phase 1
2. Завершить Phase 2
3. Завершить Phase 3 (US1)
4. Остановиться и проверить независимый сценарий US1 (`/start` + базовая навигация)

### Incremental Delivery

1. Setup + Foundational создают общий i18n-контур
2. US1 приносит бизнес-ценность (централизованный доступ к текстам)
3. US2 добавляет compile-time защиту от ошибок ключей
4. US3 закрепляет устойчивость fallback-поведения

### Parallel Team Strategy

1. Один разработчик завершает Setup + Foundational
2. После этого:
   - разработчик A: миграция хендлеров (`src/handlers/start.ts`, `src/handlers/admin.ts`, `src/handlers/fallback.ts`)
   - разработчик B: миграция утилит/фабрики (`src/utils/utils.ts`, `src/handlers/factory.ts`)
   - разработчик C: тесты (`tests/unit/i18n/t.test.ts`, `tests/integration/handlers/i18n-message-flow.test.ts`)

---

## Notes

- Все задачи соответствуют strict checklist format: checkbox, ID, опциональный `[P]`, `[USx]` только в story-фазах, явные пути файлов
- Рекомендуемый MVP scope: **только User Story 1 (Phase 3)**
- После выполнения задач следующий шаг workflow: `/speckit.implement` или ручная реализация по `tasks.md`
