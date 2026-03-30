# Data Model: Валидация API через Zod

**Feature**: 003-zod-api-validation
**Date**: 2026-03-27

---

## Схемы валидации

### groupCreateSchema — POST /groups

| Поле | Тип | Ограничения | Обязательное |
|------|-----|-------------|:---:|
| `key` | string | Только `[a-z0-9_]` | ✅ |
| `type` | enum | `'aa'` или `'alanon'` | ✅ |
| `name` | string | Не пустая | ✅ |
| `address` | string | — | ❌ |
| `phone` | string | Формат `+7 (XXX) XXX-XX-XX` (`/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/`) | ❌ |
| `description` | string | — | ❌ |
| `notes` | string | — | ❌ |
| `imageUrl` | string | URL-формат | ❌ |
| `mapLink` | string | URL-формат | ❌ |
| `videoPath` | string | URL-формат | ❌ |

**TypeScript тип**: `z.infer<typeof groupCreateSchema>`

---

### groupUpdateSchema — PUT /groups/:id

Все поля из `groupCreateSchema`, но все опциональные (`groupCreateSchema.partial()`).

**TypeScript тип**: `z.infer<typeof groupUpdateSchema>`

---

### messageUpdateSchema — PUT /messages/:key

| Поле | Тип | Ограничения | Обязательное |
|------|-----|-------------|:---:|
| `value` | string | Не пустая (min 1) | ✅ |
| `description` | string | — | ❌ |

**TypeScript тип**: `z.infer<typeof messageUpdateSchema>`

---

### urlUpdateSchema — PUT /urls/:key

| Поле | Тип | Ограничения | Обязательное |
|------|-----|-------------|:---:|
| `value` | string | Валидный URL (`z.string().url()`) | ✅ |
| `description` | string | — | ❌ |

**TypeScript тип**: `z.infer<typeof urlUpdateSchema>`

---

### settingUpdateSchema — PUT /settings/:key

| Поле | Тип | Ограничения | Обязательное |
|------|-----|-------------|:---:|
| `value` | string | Не пустая (min 1) | ✅ |
| `description` | string | — | ❌ |

**TypeScript тип**: `z.infer<typeof settingUpdateSchema>`

---

### adminCreateSchema — POST /admins

| Поле | Тип | Ограничения | Обязательное |
|------|-----|-------------|:---:|
| `telegram_id` | string | Только цифры (`/^\d+$/`) | ✅ |
| `name` | string | — | ❌ |

**TypeScript тип**: `z.infer<typeof adminCreateSchema>`

---

### schedulesReplaceSchema — PUT /groups/:id/schedules

| Поле | Тип | Ограничения | Обязательное |
|------|-----|-------------|:---:|
| `schedules` | array | Массив объектов расписания | ✅ |

**Элемент массива** (`scheduleItemSchema`):

| Поле | Тип | Ограничения | Обязательное |
|------|-----|-------------|:---:|
| `days` | enum[] | Непустой массив; каждый элемент — одно из: `Пн`, `Вт`, `Ср`, `Чт`, `Пт`, `Сб`, `Вс` | ✅ |
| `time` | string | Формат `ЧЧ:ММ` (`/^\d{2}:\d{2}$/`) | ✅ |

**TypeScript тип**: `z.infer<typeof schedulesReplaceSchema>`

---

## Middleware validateBody

**Входные данные**: Zod-схема (`ZodTypeAny`)
**Выходные данные**: Express `RequestHandler`

**Поведение**:
- Вызывает `schema.safeParse(req.body)`
- При ошибке: возвращает `400 { errors: result.error.flatten() }`
- При успехе: заменяет `req.body` на `result.data` (очищенные данные), вызывает `next()`

---

## Сводная таблица применения

| Роут | Метод | Схема |
|------|-------|-------|
| `/groups` | POST | `groupCreateSchema` |
| `/groups/:id` | PUT | `groupUpdateSchema` |
| `/groups/:id/schedules` | PUT | `schedulesReplaceSchema` |
| `/messages/:key` | PUT | `messageUpdateSchema` |
| `/urls/:key` | PUT | `urlUpdateSchema` |
| `/settings/:key` | PUT | `settingUpdateSchema` |
| `/admins` | POST | `adminCreateSchema` |
