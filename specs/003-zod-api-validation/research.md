# Research: Валидация API через Zod

**Feature**: 003-zod-api-validation
**Date**: 2026-03-27

---

## Решение 1: Библиотека валидации

**Decision**: Zod
**Rationale**: Zod — стандарт для TypeScript-проектов: схемы и типы выводятся из одного источника (`z.infer`), нет дублирования. `safeParse` не бросает исключений — идеально для middleware. Широко используется в Express-проектах.
**Alternatives considered**: `joi` (не TypeScript-first, типы отдельно), `yup` (медленнее, менее удобный API для TS), ручная валидация (уже есть — именно от неё уходим).

---

## Решение 2: Паттерн middleware

**Decision**: Фабрика `validateBody(schema)` возвращает Express middleware
**Rationale**: Один middleware параметризуется схемой — нет дублирования логики ответа 400. Роутер явно показывает, какая схема применяется к каждому роуту.
**Alternatives considered**: Валидация внутри каждого контроллера (текущий подход — уже отклонён), глобальный middleware (не различает схемы по роуту).

Пример паттерна:
```typescript
function validateBody(schema: z.ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten() });
      return;
    }
    req.body = result.data;
    next();
  };
}
```

---

## Решение 3: safeParse vs parse

**Decision**: `safeParse`
**Rationale**: Не бросает исключений — middleware явно обрабатывает ошибки и возвращает 400. `parse` требует `try/catch` и усложняет поток.
**Alternatives considered**: `parse` с try/catch — избыточно для данного контекста.

---

## Решение 4: Формат ответа при ошибке

**Decision**: `{ errors: result.error.flatten() }`
**Rationale**: `flatten()` возвращает структуру `{ fieldErrors: {...}, formErrors: [...] }` — удобно для фронта, показывает ошибки по каждому полю отдельно.
**Alternatives considered**: `result.error.issues` — сырой массив, менее удобен для отображения; простая строка — теряет детали.

---

## Решение 5: Обработка неизвестных полей

**Decision**: Zod по умолчанию (strip — неизвестные поля удаляются)
**Rationale**: `result.data` содержит только задекларированные поля. Это безопасно: контроллер не получает лишних данных. Не нужно `.strict()` (будет ошибка при лишних полях от фронта).
**Alternatives considered**: `.strict()` — слишком строго, может сломать фронт при добавлении новых полей; `.passthrough()` — небезопасно, пропускает всё.

---

## Решение 6: Типы TypeScript из схем

**Decision**: Использовать `z.infer<typeof schema>` вместо ручных интерфейсов
**Rationale**: Единственный источник истины — схема. При изменении схемы типы обновляются автоматически.
**Alternatives considered**: Дублировать типы вручную — нарушает DRY.

---

## Решение 7: Схема для groupUpdateSchema

**Decision**: Отдельная схема `groupUpdateSchema` — все поля опциональные (partial)
**Rationale**: `PUT /groups/:id` принимает частичное обновление. `groupCreateSchema.partial()` даёт именно это без дублирования.
**Alternatives considered**: Одна схема для create и update — невозможно, у create обязательные поля.

---

## Решение 8: Схема для replaceSchedules

**Decision**: Отдельная схема `schedulesReplaceSchema` — `{ schedules: z.array(scheduleItemSchema) }`
**Rationale**: `PUT /groups/:id/schedules` принимает отдельную структуру, не связанную со схемой группы.
**Alternatives considered**: Не валидировать (оставить текущее поведение `req.body.schedules || []`) — не соответствует цели фичи.

---

## Итог: новые файлы

| Файл | Назначение |
|------|-----------|
| `src/api/validation/validateBody.ts` | Middleware-фабрика |
| `src/api/validation/groupSchema.ts` | Схемы для создания и обновления группы |
| `src/api/validation/messageSchema.ts` | Схема для обновления сообщения |
| `src/api/validation/urlSchema.ts` | Схема для обновления URL |
| `src/api/validation/settingSchema.ts` | Схема для обновления настройки |
| `src/api/validation/adminSchema.ts` | Схема для добавления администратора |
| `src/api/validation/schedulesSchema.ts` | Схема для замены расписаний группы |
