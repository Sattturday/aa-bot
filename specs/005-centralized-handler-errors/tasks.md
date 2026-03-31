# Tasks: Централизованная обработка ошибок в Telegram-хендлерах

**Input**: Design documents from `/specs/005-centralized-handler-errors/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Требуются. План и конституция требуют добавить `npm test`, unit-тесты для wrapper и проверки error-path/regression сценариев.

**Organization**: Задачи сгруппированы по пользовательским историям, чтобы каждая история оставалась independently testable.

## Format: `[ID] [Story] Description`

- **[Story]**: Принадлежность к пользовательской истории (`US1`, `US2`, `US3`)
- Каждая задача содержит точный путь файла

---

## Phase 1: Setup

**Purpose**: Подготовить тестовый каркас и базовую структуру для новой инфраструктуры обработки ошибок

- [x] T001 Обновить test-команды и базовую конфигурацию TypeScript для тестов в `package.json` и `tsconfig.json`
- [x] T002 Создать базовую структуру тестов и общие test helper-файлы в `tests/unit/utils/handlers/withErrorHandler.test.ts` и `tests/integration/handlers/registration-error-flow.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Создать общий wrapper и типы, без которых нельзя безопасно внедрять user stories

**⚠️ CRITICAL**: Ни одна пользовательская история не должна начинаться до завершения этого этапа

- [x] T003 Создать типы общей обработки ошибок в `src/utils/handlers/types.ts`
- [x] T004 Реализовать единый wrapper `withErrorHandler` в `src/utils/handlers/withErrorHandler.ts`
- [x] T005 Подготовить экспорт и повторное использование новых типов/сигнатур в `src/handlers/types.ts` и `src/handlers/factory.ts`

**Checkpoint**: Wrapper и его контракты готовы, можно подключать user story implementation

---

## Phase 3: User Story 1 - Понятное сообщение при сбое (Priority: P1) 🎯 MVP

**Goal**: Пользователь получает единое fallback-сообщение при ошибке в любом критичном прямом Telegram-хендлере

**Independent Test**: Искусственно вызвать ошибку в `start`, `back`, `admin`, `groups` и `fallback` сценариях и убедиться, что пользователь получает `Произошла ошибка. Попробуйте ещё раз или нажмите /start`.

### Tests for User Story 1

- [x] T006 [US1] Добавить unit-тесты для fallback-сообщения, логирования и проглатывания вторичной ошибки в `tests/unit/utils/handlers/withErrorHandler.test.ts`
- [x] T007 [US1] Добавить integration-style тест на error-path для прямой регистрации хендлера в `tests/integration/handlers/registration-error-flow.test.ts`

### Implementation for User Story 1

- [x] T008 [US1] Подключить `withErrorHandler` к `/start` и стартовым action-хендлерам в `src/handlers/start.ts`
- [x] T009 [US1] Подключить `withErrorHandler` к обработчикам `back` и `admin_panel` в `src/handlers/back.ts` и `src/handlers/admin.ts`
- [x] T010 [US1] Подключить `withErrorHandler` к статическим и динамическим group-хендлерам в `src/handlers/groups.ts`
- [x] T011 [US1] Подключить `withErrorHandler` к `text` и `message` fallback-сценариям в `src/handlers/fallback.ts`

**Checkpoint**: При сбое в прямых точках входа бот отвечает единым fallback-сообщением и не падает

---

## Phase 4: User Story 2 - Единое поведение ошибок во всех обработчиках (Priority: P2)

**Goal**: Все фабричные и отдельно подключаемые хендлеры используют один и тот же путь логирования и error handling без локального дублирования

**Independent Test**: Искусственно вызвать ошибки в фабрично зарегистрированном handler и в standalone handler, затем сравнить структуру логов и fallback-поведение.

### Tests for User Story 2

- [x] T012 [US2] Расширить проверки на единый формат `label`/`userId` для factory и standalone сценариев в `tests/unit/utils/handlers/withErrorHandler.test.ts` и `tests/integration/handlers/registration-error-flow.test.ts`

### Implementation for User Story 2

- [x] T013 [US2] Интегрировать `withErrorHandler` в фабричную регистрацию кнопок и убрать локальный `try/catch` из `src/handlers/factory.ts`
- [x] T014 [US2] Проверить и скорректировать вызовы фабрики в `src/handlers/welcome.ts`, `src/handlers/newbie.ts`, `src/handlers/participant.ts`, `src/handlers/relative.ts`, `src/handlers/faq.ts` и `src/handlers/about_aa.ts`
- [x] T015 [US2] Нормализовать label-стратегию и структуру логирования во всех точках регистрации в `src/utils/handlers/withErrorHandler.ts`, `src/handlers/factory.ts`, `src/handlers/start.ts`, `src/handlers/groups.ts`, `src/handlers/back.ts`, `src/handlers/admin.ts` и `src/handlers/fallback.ts`

**Checkpoint**: Все точки регистрации используют единый wrapper, а локальное дублирование в хендлерах устранено

---

## Phase 5: User Story 3 - Отсутствие регрессий (Priority: P3)

**Goal**: Штатные сценарии без ошибок работают как раньше, а новая обработка ошибок не ломает навигацию и существующий UX

**Independent Test**: Пройти `/start`, кнопки навигации, `back`, `admin_panel`, `text/message` fallback без искусственных ошибок и подтвердить, что ответы не изменились.

### Tests for User Story 3

- [x] T016 [US3] Добавить regression-проверки успешного пути и отсутствия лишних fallback-ответов в `tests/integration/handlers/registration-error-flow.test.ts`

### Implementation for User Story 3

- [x] T017 [US3] Убедиться, что успешные ветки хендлеров не изменили поведение и при необходимости скорректировать вызовы в `src/handlers/start.ts`, `src/handlers/groups.ts`, `src/handlers/back.ts`, `src/handlers/admin.ts` и `src/handlers/fallback.ts`
- [x] T018 [US3] Проверить совместимость wrapper с существующими helper-вызовами в `src/utils/utils.ts` и оставить специальные локальные fallback-ветки только там, где они дают отдельный UX

**Checkpoint**: Успешные пользовательские сценарии сохраняют текущий UX, а error handling не вносит регрессий

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Финальная сборка, документация и контроль качества по всем историям

- [x] T019 Обновить документацию по реализации и проверочным шагам в `specs/005-centralized-handler-errors/quickstart.md`
- [ ] T020 Выполнить финальную верификацию через `package.json`, `tests/unit/utils/handlers/withErrorHandler.test.ts`, `tests/integration/handlers/registration-error-flow.test.ts` и зафиксировать рабочий набор команд `npm test`, `npm run build`, `cd admin && npm run build`, `cd admin && npm run lint`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: можно начать сразу
- **Foundational (Phase 2)**: зависит от Setup и блокирует все user stories
- **User Story 1 (Phase 3)**: зависит от завершения Foundational
- **User Story 2 (Phase 4)**: зависит от Foundational; логически следует после US1, потому что расширяет wrapper на все фабричные сценарии
- **User Story 3 (Phase 5)**: зависит от US1 и US2, так как проверяет отсутствие регрессий после полного внедрения
- **Polish (Phase 6)**: после завершения нужных user stories

### User Story Dependencies

- **US1 (P1)**: не зависит от других историй и образует MVP
- **US2 (P2)**: использует общий wrapper из Foundational и расширяет его применение на фабричные сценарии
- **US3 (P3)**: подтверждает, что US1 + US2 не сломали успешные сценарии

### Within Each User Story

- Сначала тесты
- Затем подключение/рефакторинг хендлеров
- Затем выравнивание поведения и финальная локальная проверка

## Parallel Execution Opportunities

### User Story 1

- T009 и T010 можно делать параллельно после T008
- T011 можно делать параллельно с T009/T010, так как он затрагивает другой файл

### User Story 2

- T014 можно делать параллельно с подготовкой T015 после завершения T013

### User Story 3

- T017 и T018 можно выполнять параллельно, если заранее согласован write ownership по файлам

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Завершить Phase 1: Setup
2. Завершить Phase 2: Foundational
3. Завершить Phase 3: US1
4. Остановиться и проверить error-path в прямых хендлерах

### Incremental Delivery

1. Setup + Foundational создают общий wrapper и test harness
2. US1 даёт пользовательскую ценность: понятный fallback при сбоях
3. US2 завершает рефакторинг и унификацию всех точек регистрации
4. US3 подтверждает отсутствие регрессий в штатном UX

### Parallel Team Strategy

1. Один разработчик закрывает Phase 1-2
2. После этого:
   - разработчик A берёт `src/handlers/start.ts`, `src/handlers/back.ts`, `src/handlers/admin.ts`
   - разработчик B берёт `src/handlers/groups.ts` и `src/handlers/fallback.ts`
   - разработчик C готовит и расширяет тесты в `tests/`

---

## Notes

- Все задачи следуют strict checklist format и содержат точные пути файлов
- MVP для этой фичи — User Story 1
- Специальные локальные fallback-ветки вне Telegram entry points допустимы только если они сохраняют отдельный UX и явно не дублируют общий handler wrapper
- После выполнения задач следующий шаг workflow не требуется: `tasks.md` является последним обязательным артефактом planning chain
