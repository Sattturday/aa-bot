# Contract: validateBody Middleware

**Feature**: 003-zod-api-validation
**File**: `src/api/validation/validateBody.ts`

---

## Сигнатура

```typescript
function validateBody(schema: z.ZodTypeAny): RequestHandler
```

---

## Входные данные

| Параметр | Тип | Описание |
|----------|-----|----------|
| `schema` | `z.ZodTypeAny` | Zod-схема для валидации `req.body` |

---

## Поведение

### Успешная валидация

**Given** `req.body` соответствует `schema`
**When** middleware вызывается
**Then**:
- `req.body` заменяется на `result.data` (очищенный объект без лишних полей)
- вызывается `next()`
- ответ не отправляется

### Неуспешная валидация

**Given** `req.body` НЕ соответствует `schema`
**When** middleware вызывается
**Then**:
- `next()` НЕ вызывается
- возвращается ответ `400 Bad Request`
- тело ответа: `{ "errors": { "fieldErrors": {...}, "formErrors": [...] } }`

---

## Формат ответа при ошибке

```json
{
  "errors": {
    "fieldErrors": {
      "telegram_id": ["Строка должна содержать только цифры"],
      "value": ["Обязательное поле"]
    },
    "formErrors": []
  }
}
```

---

## Применение в router.ts

```typescript
import { validateBody } from './validation/validateBody';
import { groupCreateSchema } from './validation/groupSchema';

router.post('/groups', validateBody(groupCreateSchema), groups.createGroup);
```

---

## Ограничения

- Валидирует только `req.body`; query-параметры и path-параметры не затрагиваются
- Использует `safeParse` — не бросает исключений
- Неизвестные поля из `req.body` удаляются (поведение Zod по умолчанию: strip)
