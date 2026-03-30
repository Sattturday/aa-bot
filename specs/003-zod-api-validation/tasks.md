# Tasks: Валидация API через Zod

**Input**: Design documents from `/specs/003-zod-api-validation/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: Задачи сгруппированы по user story для независимой реализации и проверки каждой истории.

---

## Phase 1: Setup (Установка зависимости)

**Purpose**: Добавить `zod` в проект — единственная внешняя предпосылка.

- [x] T001 Установить зависимость `zod` командой `npm install zod` в корне репозитория

---

## Phase 2: Foundational (Блокирующая предпосылка)

**Purpose**: Реализовать middleware `validateBody` — используется во всех роутах US1 и является общим компонентом для обеих user story.

**⚠️ CRITICAL**: Phase 3 (US1) не может начаться без завершения этой фазы.

- [x] T002 Создать `src/api/validation/validateBody.ts` — функция `validateBody(schema: ZodTypeAny): RequestHandler`: вызывает `schema.safeParse(req.body)`; при ошибке — `res.status(400).json({ errors: result.error.flatten() })`; при успехе — `req.body = result.data; next()`

**Checkpoint**: Middleware компилируется. Можно создавать схемы и регистрировать в роутере.

---

## Phase 3: User Story 1 — Невалидные данные отклоняются на уровне роутера (Priority: P1) 🎯 MVP

**Goal**: Все 7 API-роутов, принимающих тело запроса, защищены Zod-схемами. Невалидный payload возвращает 400 с деталями ошибки.

**Independent Test**: Отправить POST на `/api/groups` с `{"name":"Test"}` (отсутствует `key` и `type`) — получить `400` с `fieldErrors`. Отправить валидный payload — получить `201`.

### Implementation for User Story 1

- [x] T003 [P] [US1] Создать `src/api/validation/groupSchema.ts` — экспортировать `groupCreateSchema` (key: `/^[a-z0-9_]+$/`, type: `z.enum(['aa','alanon'])`, name: `z.string().min(1)`, phone: `z.string().regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/).optional()`, imageUrl/mapLink/videoPath: `z.string().url().optional()`, остальные — `z.string().optional()`) и `groupUpdateSchema = groupCreateSchema.partial()`
- [x] T004 [P] [US1] Создать `src/api/validation/schedulesSchema.ts` — экспортировать `schedulesReplaceSchema`: `{ schedules: z.array(scheduleItemSchema) }`, где `scheduleItemSchema = { days: z.array(z.enum(['Пн','Вт','Ср','Чт','Пт','Сб','Вс'])).min(1), time: z.string().regex(/^\d{2}:\d{2}$/) }`
- [x] T005 [P] [US1] Создать `src/api/validation/messageSchema.ts` — экспортировать `messageUpdateSchema`: `{ value: z.string().min(1), description: z.string().optional() }`
- [x] T006 [P] [US1] Создать `src/api/validation/urlSchema.ts` — экспортировать `urlUpdateSchema`: `{ value: z.string().url(), description: z.string().optional() }`
- [x] T007 [P] [US1] Создать `src/api/validation/settingSchema.ts` — экспортировать `settingUpdateSchema`: `{ value: z.string().min(1), description: z.string().optional() }`
- [x] T008 [P] [US1] Создать `src/api/validation/adminSchema.ts` — экспортировать `adminCreateSchema`: `{ telegram_id: z.string().regex(/^\d+$/), name: z.string().optional() }`
- [x] T009 [US1] Обновить `src/api/router.ts` — добавить `validateBody(schema)` перед обработчиком для 7 роутов: `POST /groups` → `groupCreateSchema`; `PUT /groups/:id` → `groupUpdateSchema`; `PUT /groups/:id/schedules` → `schedulesReplaceSchema`; `PUT /messages/:key` → `messageUpdateSchema`; `PUT /urls/:key` → `urlUpdateSchema`; `PUT /settings/:key` → `settingUpdateSchema`; `POST /admins` → `adminCreateSchema`

**Checkpoint**: `npm run build` проходит. POST на `/api/groups` с невалидным телом возвращает 400.

---

## Phase 4: User Story 2 — Контроллеры очищены от ручной валидации (Priority: P2)

**Goal**: Ни один контроллер не содержит кода проверки входных данных — вся валидационная логика находится в схемах.

**Independent Test**: Открыть каждый из 5 контроллеров — отсутствуют блоки `if (!field)`, `typeof field`, проверки регулярных выражений для входных данных.

### Implementation for User Story 2

- [x] T010 [P] [US2] Удалить ручную валидацию из `src/api/groupsController.ts`: убрать блоки проверки `key`, `name`, `type` и regex для `key` в функции `createGroup` (сохранить бизнес-логику — вызов `groupsRepo.createGroup`, `invalidateGroups`, обработку ошибок репозитория)
- [x] T011 [P] [US2] Удалить ручную валидацию из `src/api/messagesController.ts`: убрать блок `if (!value)` в функции `updateMessage`
- [x] T012 [P] [US2] Удалить ручную валидацию из `src/api/urlsController.ts`: убрать блок `if (!value)` в функции `updateUrl`
- [x] T013 [P] [US2] Удалить ручную валидацию из `src/api/settingsController.ts`: убрать блок `if (!value)` в функции `updateSetting`
- [x] T014 [P] [US2] Удалить ручную валидацию из `src/api/adminsController.ts`: убрать блок `if (!telegram_id)` в функции `addAdmin`
- [x] T015 [US2] Запустить `npm run build` (`. ~/.nvm/nvm.sh && nvm use 18 && npm run build`) и устранить все ошибки TypeScript

**Checkpoint**: Проект собирается без ошибок. Контроллеры содержат только бизнес-логику.

---

## Phase 5: Polish

**Purpose**: Документация нового кода согласно Конституции VI (Google Docstring на русском).

- [x] T016 Добавить Google Docstring-комментарий к `src/api/validation/validateBody.ts` (описание функции, Args: schema, Returns: RequestHandler, поведение при ошибке)
- [x] T017 Добавить краткий однострочный JSDoc-комментарий к каждой схеме в `src/api/validation/` (7 файлов — одна строка над экспортом)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Нет зависимостей — начать немедленно
- **Foundational (Phase 2)**: Зависит от Phase 1 — блокирует US1
- **US1 (Phase 3)**: Зависит от Phase 2 (validateBody должен существовать); T003–T008 независимы друг от друга; T009 ждёт T003–T008
- **US2 (Phase 4)**: Зависит от завершения Phase 3 (T009 должен быть готов — роутер уже использует middleware); T010–T014 независимы друг от друга; T015 ждёт T010–T014
- **Polish (Phase 5)**: Зависит от завершения Phase 4

### Параллельность внутри фаз

**Phase 3 (US1)**: T003, T004, T005, T006, T007, T008 — полностью параллельны (разные файлы, нет взаимных зависимостей)

**Phase 4 (US2)**: T010, T011, T012, T013, T014 — полностью параллельны (разные файлы)

---

## Implementation Strategy

### MVP First (User Story 1)

1. Завершить Phase 1: Setup (T001)
2. Завершить Phase 2: Foundational (T002)
3. Завершить Phase 3: US1 (T003–T009) — API защищён валидацией
4. **STOP and VALIDATE**: Проверить что невалидные данные отклоняются, валидные проходят
5. Продолжить с Phase 4

### Incremental Delivery

1. Phase 1+2 → validateBody готов
2. Phase 3 → все роуты защищены (MVP валидации) ✅
3. Phase 4 → контроллеры очищены, единственный источник правил
4. Phase 5 → документация добавлена

### Parallel Strategy

Один разработчик: выполнять последовательно (T001 → T002 → T003–T008 параллельно → T009 → T010–T014 параллельно → T015 → T016–T017).

---

## Notes

- `[USN]` — принадлежность к user story для трассировки
- `npm run build` требует Node.js 18: запускать как `. ~/.nvm/nvm.sh && nvm use 18 && npm run build`
- T015 (`npm run build`) — объективная точка проверки корректности всей работы
- При создании схем использовать `safeParse`, не `parse`; ошибки возвращать через `error.flatten()`
- Неизвестные поля в `req.body` молча удаляются (strip — стандартное поведение Zod)
