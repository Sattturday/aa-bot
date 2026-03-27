# Tasks: Рефакторинг обработчиков Telegram

**Input**: Design documents from `/specs/002-refactor-handlers/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Задачи сгруппированы по user story для независимой реализации и проверки каждой истории.

---

## Phase 1: Setup (Инициализация структуры)

**Purpose**: Создать директорию `src/handlers/` — единственная структурная предпосылка для всех последующих задач.

- [x] T001 Создать директорию `src/handlers/` (пустая — заполняется в следующих фазах)

---

## Phase 2: Foundational (Блокирующие предпосылки)

**Purpose**: Реализовать типы и фабрику `registerCategory`. Без этого ни одна категория не может быть перенесена.

**⚠️ CRITICAL**: Фазы US1 и US2 не могут начаться без завершения этой фазы.

- [x] T002 Создать файл `src/handlers/types.ts` с интерфейсами `KeyMapResult` и `RegisterCategoryOptions` согласно `specs/002-refactor-handlers/data-model.md`
- [x] T003 Реализовать функцию `registerCategory` в `src/handlers/factory.ts` согласно контракту `specs/002-refactor-handlers/contracts/factory-contract.md` (импортировать из `types.ts`, `navigationStack.ts`, `history.ts`, `utils.ts`)

**Checkpoint**: Фабрика реализована и компилируется. Можно начинать перенос категорий.

---

## Phase 3: User Story 1 — Централизованная регистрация (Priority: P1) 🎯 MVP

**Goal**: Все категориальные обработчики (welcome, newbie, participant, faq, about_aa, relative) реализованы через фабрику `registerCategory`. Дублирование паттерна регистрации устранено.

**Independent Test**: Добавить тестовый вызов `registerCategory` в `index.ts` для одной категории — бот регистрирует обработчики без ручного `bot.action`.

### Implementation for User Story 1

- [x] T004 [US1] Реализовать `src/handlers/welcome.ts` — категория `welcome`, прямой mapper (`key → key`), вызов `registerCategory`
- [x] T005 [US1] Реализовать `src/handlers/faq.ts` — категория `faq`, прямой mapper (`key → key`)
- [x] T006 [US1] Реализовать `src/handlers/about_aa.ts` — категория `about_aa`, прямой mapper (`key → key`)
- [x] T007 [US1] Реализовать `src/handlers/newbie.ts` — категория `newbie`, кастомный mapper: `newbie_group_schedule → group_schedule + imageUrl('group_schedule')`; `newbie_about_aa → about_aa`; `newbie_literature → literature`; остальные `key → key`
- [x] T008 [US1] Реализовать `src/handlers/participant.ts` — категория `participant`, кастомный mapper: `participant_group_schedule → group_schedule + imageUrl('group_schedule')`; `participant_literature → literature`; остальные `key → key`
- [x] T009 [US1] Реализовать `src/handlers/relative.ts` — категория `relative`, кастомный mapper: `relative_about_aa → about_aa`; остальные `key → key`

**Checkpoint**: Все 6 категорий реализованы через фабрику. Повторяющийся паттерн `bot.action + answerCbQuery + pushToStack + track + handleButtonAction` встречается только в `factory.ts`. `npm run build` (после финальной интеграции) проходит.

---

## Phase 4: User Story 2 — Разделение по файлам (Priority: P2)

**Goal**: Все оставшиеся обработчики (start, groups, back, admin, fallback) вынесены в отдельные файлы. Создан оркестратор `index.ts`. Структура `src/handlers/` полностью сформирована.

**Independent Test**: Открыть `src/handlers/` — 13 файлов, каждый содержит ровно одну категорию логики. Найти любой обработчик менее чем за 30 секунд.

### Implementation for User Story 2

- [x] T010 [US2] Реализовать `src/handlers/start.ts` — команда `/start` (replyWithPhoto + приветственное сообщение) и buttonKeys.start (deleteMessage + sendWelcomeMessage), используя `pushToStack(userId, 'start')`
- [x] T011 [US2] Реализовать `src/handlers/groups.ts` — статические группы (getGroupScheduleKeys + forEach + handleGroupInfo) и динамический catch-all `bot.action(/^group_/)` с той же логикой
- [x] T012 [US2] Реализовать `src/handlers/back.ts` — action `back`: popFromStack → if `welcome` → deleteMessage + clearUserNavigationStack + sendWelcomeMessage; иначе → handleButtonAction; default → deleteMessage + sendWelcomeMessage
- [x] T013 [US2] Реализовать `src/handlers/admin.ts` — action `admin_panel`: проверка isAdmin, track, reply с WebApp-кнопкой по WEBAPP_URL
- [x] T014 [US2] Реализовать `src/handlers/fallback.ts` — action `no_action` (answerCbQuery 'Пока недоступно'), `bot.on('text')` (track + sendWelcomeMessage), `bot.on('message')` (track + reply с кнопками)
- [x] T015 [US2] Создать `src/handlers/index.ts` с функцией `registerAllHandlers(bot)` — импортировать и вызвать все модули в порядке из `specs/002-refactor-handlers/contracts/factory-contract.md` (no_action → start → welcome → newbie → participant → faq → about_aa → relative → groups → back → admin → fallback)

**Checkpoint**: Все 13 файлов в `src/handlers/` заполнены. `registerAllHandlers` полностью собирает всю логику. Структура соответствует `specs/002-refactor-handlers/data-model.md`.

---

## Phase 5: User Story 3 — Сохранение поведения (Priority: P3)

**Goal**: Старый файл удалён, импорт обновлён, бот ведёт себя идентично.

**Independent Test**: Запустить бота (`npm run dev`) и проверить вручную: `/start`, все кнопки категорий, кнопку «Назад», экраны с изображениями, fallback на неизвестные сообщения.

### Implementation for User Story 3

- [x] T016 [US3] Обновить `src/index.ts`: заменить `import { registerButtonHandlers } from './utils/handlers'` на `import { registerAllHandlers } from './handlers/index'` и обновить вызов
- [x] T017 [US3] Удалить файл `src/utils/handlers.ts`
- [x] T018 [US3] Запустить `npm run build` и устранить все ошибки TypeScript (ожидаемые: нет; если есть — исправить несоответствия импортов)
- [x] T019 [US3] Ручная проверка по чеклисту: `/start` работает → все кнопки главного меню работают → кнопка «Назад» возвращает на предыдущий экран → экраны с фото (newbie_group_schedule, participant_group_schedule, группы) отображают изображения → неизвестный текст получает fallback-ответ

**Checkpoint**: Проект собирается без ошибок. Поведение бота идентично исходному.

---

## Phase 6: Polish

**Purpose**: Документация нового кода согласно Конституции VI (Google Docstring на русском).

- [x] T020 Добавить Google Docstring-комментарии к `src/handlers/factory.ts` (функция `registerCategory`, интерфейсы)
- [x] T021 Добавить краткие JSDoc-комментарии к `src/handlers/index.ts` (функция `registerAllHandlers`, порядок регистрации)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Нет зависимостей — начать немедленно
- **Foundational (Phase 2)**: Зависит от Phase 1 — блокирует все user story
- **US1 (Phase 3)**: Зависит от Phase 2 (factory.ts должен существовать)
- **US2 (Phase 4)**: Зависит от Phase 2 (factory.ts для category-файлов); T010-T014 можно параллельно с Phase 3
- **US3 (Phase 5)**: Зависит от завершения Phase 3 И Phase 4 (index.ts должен быть готов)
- **Polish (Phase 6)**: Зависит от Phase 5

### Параллельность внутри фаз

**Phase 3**: T005-T009 можно реализовывать параллельно (разные файлы, нет взаимных зависимостей)

**Phase 4**: T011-T014 можно реализовывать параллельно; T015 (index.ts) ждёт T010-T014

**Phase 6**: T020 и T021 параллельны

### User Story Dependencies

- **US1 (P1)**: Стартует после Foundational
- **US2 (P2)**: T010-T014 стартуют после Foundational; T015 ждёт T010-T014
- **US3 (P3)**: Стартует после завершения US1 + US2 (T015 готов)

---

## Implementation Strategy

### MVP First (User Story 1)

1. Завершить Phase 1: Setup (T001)
2. Завершить Phase 2: Foundational (T002, T003)
3. Завершить Phase 3: US1 (T004–T009) — фабрика работает для 6 категорий
4. **STOP and VALIDATE**: Убедиться что `registerCategory` правильно регистрирует обработчики
5. Продолжить с Phase 4

### Incremental Delivery

1. Phase 1+2 → Фабрика готова
2. Phase 3 → Категорийные обработчики перенесены (MVP рефакторинга)
3. Phase 4 → Все обработчики разделены по файлам
4. Phase 5 → Старый файл удалён, бот работает с новой структурой ✅
5. Phase 6 → Документация добавлена

### Parallel Strategy

Один разработчик: выполнять последовательно.
Два разработчика:
- Dev A: T004, T007, T008 (newbie, participant — сложные mappers)
- Dev B: T005, T006, T009, T010-T014 (простые категории + standalone)
- Совместно: T015 (index.ts), затем T016-T019

---

## Notes

- `[USN]` — принадлежность к user story для трассировки
- Коммит после каждой фазы (не после каждой задачи)
- T018 (`npm run build`) — объективная точка проверки корректности всей работы
- Обработчики T010-T014 **не используют** фабрику — у них уникальная логика, несовместимая с паттерном категории
