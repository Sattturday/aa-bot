# План рефакторинга

## Контекст

Проект начинался спонтанно, архитектура складывалась по ходу. Сейчас бот работает стабильно (~3750 строк), но код содержит дублирование, слабую типизацию и монолитные файлы, которые затрудняют развитие. Цель рефакторинга -- упростить код, убрать дублирование и сделать архитектуру понятной, не ломая работающий функционал.

**Принцип:** инкрементальный рефакторинг, каждый шаг -- отдельный коммит, бот остаётся рабочим после каждого шага.

---

## Шаг 1. Вынести навигационный стек в отдельный модуль

**Проблема:** навигационный стек живёт в `src/index.ts` (строки 37-71) и экспортируется оттуда. `handlers.ts` импортирует `pushToStack`, `popFromStack`, `clearUserNavigationStack` из `..` (index.ts) -- это создаёт неявную связь entry point → бизнес-логика.

**Решение:** создать `src/utils/navigationStack.ts`

```
src/utils/navigationStack.ts
├── type NavigationState = 'start' | 'welcome' | 'newbie' | 'participant'
│     | 'relative' | 'faq' | 'about_aa' | 'group_schedule'
├── pushToStack(userId: string, state: NavigationState): void
├── popFromStack(userId: string): NavigationState | null
└── clearStack(userId: string): void
```

**Файлы:**
- Создать: `src/utils/navigationStack.ts`
- Изменить: `src/index.ts` -- убрать стек, импортировать из нового модуля
- Изменить: `src/utils/handlers.ts` -- импортировать из `./navigationStack` вместо `..`

---

## Шаг 2. Разбить handlers.ts -- фабрика + категории

**Проблема:** `src/utils/handlers.ts` (332 строки) -- самый большой файл. Содержит 6 одинаковых блоков регистрации (строки 58-253), отличающихся только именем категории и мелкой логикой маппинга ключей.

**Решение:** извлечь фабричную функцию и разделить на файлы.

### 2a. Фабрика регистрации

Создать хелпер, который инкапсулирует повторяющийся паттерн:

```typescript
// src/utils/handlers/registerCategory.ts

type KeyMapper = (key: string) => { action: string; hasImage?: boolean; imageUrl?: string };

function registerCategory(
  bot: Telegraf,
  category: NavigationState,
  keys: string[],
  mapKey: KeyMapper = (key) => ({ action: key }),
): void {
  keys.forEach(key => {
    bot.action(key, async ctx => {
      try {
        await ctx.answerCbQuery();
        const { userId } = getUserInfo(ctx);
        pushToStack(userId, category);
        track(ctx, key);

        const mapped = mapKey(key);
        if (mapped.hasImage && mapped.imageUrl) {
          await handleButtonActionWithImage(ctx, mapped.action, mapped.imageUrl);
        } else {
          await handleButtonAction(ctx, mapped.action);
        }
      } catch (error) {
        console.error(`Ошибка в обработчике ${category}:${key}:`, error);
      }
    });
  });
}
```

### 2b. Разделить на файлы

```
src/utils/handlers/
├── index.ts              -- registerAllHandlers() -- оркестрирует всё
├── registerCategory.ts   -- фабрика (см. выше)
├── startHandler.ts       -- /start + welcome
├── groupHandlers.ts      -- динамические группы + catch-all /^group_/
├── backHandler.ts        -- кнопка "Назад"
├── adminHandler.ts       -- кнопка "Админ-панель"
└── fallbackHandlers.ts   -- text + unknown message
```

**Результат:** каждая категория (newbie, participant, relative, faq, about_aa) регистрируется одной строкой:

```typescript
registerCategory(bot, 'newbie', buttonKeys.newbie, newbieMapper);
registerCategory(bot, 'participant', buttonKeys.participant, participantMapper);
registerCategory(bot, 'welcome', buttonKeys.welcome);
registerCategory(bot, 'faq', buttonKeys.faq);
registerCategory(bot, 'about_aa', buttonKeys.about_aa);
registerCategory(bot, 'relative', buttonKeys.relative, relativeMapper);
```

**Файлы:**
- Создать: `src/utils/handlers/` (5-6 файлов)
- Удалить: `src/utils/handlers.ts` (старый монолит)
- Изменить: `src/index.ts` -- обновить импорт

---

## Шаг 3. Убрать дублирование generateGroupScheduleMessage

**Проблема:** функция `generateGroupScheduleMessage` определена в двух местах:
- `src/utils/utils.ts` (строки 159-175)
- `src/db/dataProvider.ts` (строки 130-143)

Идентичная логика, два места для поддержки.

**Решение:** оставить только в `src/db/dataProvider.ts` (там она используется для вычисления текстов сообщений), убрать из `src/utils/utils.ts`.

**Файлы:**
- Изменить: `src/utils/utils.ts` -- удалить функцию (строки 158-175)
- Проверить: нет ли внешних импортов этой функции из utils.ts

---

## Шаг 4. Убрать лишние зависимости

**Проблема:** `package.json` содержит `fs` и `path` как npm-пакеты. Это встроенные модули Node.js, устанавливать их через npm не нужно (пакет `fs@0.0.1-security` -- заглушка-предупреждение).

**Решение:**
```bash
npm uninstall fs path
```

**Файлы:**
- Изменить: `package.json` -- удалить из dependencies

---

## Шаг 5. Добавить валидацию API (Zod)

**Проблема:** контроллеры `messagesController`, `urlsController`, `settingsController`, `adminsController` (по 21-23 строки) не валидируют входные данные. Только `groupsController` проверяет формат ключа и обязательные поля.

**Решение:** добавить Zod-схемы для каждого ресурса.

```
src/api/
├── validation/
│   ├── groupSchema.ts     -- перенести существующую валидацию из groupsController
│   ├── messageSchema.ts   -- key: string, value: string (non-empty)
│   ├── urlSchema.ts       -- key: string, value: z.string().url()
│   ├── settingSchema.ts   -- key: string, value: string
│   └── adminSchema.ts     -- telegram_id: z.string().regex(/^\d+$/)
```

Middleware `validateBody(schema)` для Express:
```typescript
function validateBody(schema: ZodSchema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() });
    }
    req.body = result.data;
    next();
  };
}
```

**Файлы:**
- Установить: `zod`
- Создать: `src/api/validation/` (5 файлов + middleware)
- Изменить: контроллеры -- использовать middleware в роутере

---

## Шаг 6. Типизировать кнопки и ключи

**Проблема:** `buttonKeys` и `buttons` используют `string` для ключей. При добавлении нового экрана нужно помнить обновить оба файла + handlers. Ошибки обнаруживаются только в рантайме.

**Решение:** типизировать через `as const` + вывод типов.

```typescript
// src/data/buttonKeys.ts
export const buttonKeys = {
  start: ['welcome'],
  welcome: ['newbie', 'participant', 'relative', 'ask_question'],
  // ...
} as const;

export type ScreenKey = keyof typeof buttonKeys;
export type ButtonKey = typeof buttonKeys[ScreenKey][number];
```

```typescript
// src/data/buttons.ts
import type { ScreenKey } from './buttonKeys';

type Buttons = Record<string, ButtonRow[]>;  // -> Record<ScreenKey | ButtonKey, ButtonRow[]>
```

**Файлы:**
- Изменить: `src/data/buttonKeys.ts` -- добавить `as const` и типы
- Изменить: `src/data/buttons.ts` -- типизировать ключи
- Изменить: `src/utils/utils.ts` -- использовать типы

---

## Шаг 7. Исправить тип AdminRow на фронтенде

**Проблема:** `admin/src/api/client.ts` определяет `AdminRow.telegram_id` как `number`, а бэкенд (`src/types/index.ts`) -- как `string`. Работает из-за неявного приведения типов, но это бомба.

**Решение:** изменить на `string` в `admin/src/api/client.ts`.

**Файлы:**
- Изменить: `admin/src/api/client.ts` -- `telegram_id: string`
- Проверить: все места на фронте, где `telegram_id` используется как число

---

## Шаг 8. Централизовать обработку ошибок в хендлерах

**Проблема:** каждый хендлер в handlers.ts оборачивает логику в свой try-catch с `console.error`. Пользователь не получает feedback при ошибке.

**Решение:** error-handling обёртка (интегрируется с фабрикой из шага 2):

```typescript
// src/utils/handlers/withErrorHandler.ts
function withErrorHandler(
  handler: (ctx: Context) => Promise<void>,
  label: string,
) {
  return async (ctx: Context) => {
    try {
      await handler(ctx);
    } catch (error) {
      console.error(`Ошибка [${label}]:`, error);
      try {
        await ctx.reply('Произошла ошибка. Попробуйте ещё раз или нажмите /start');
      } catch { /* ignore reply error */ }
    }
  };
}
```

**Файлы:**
- Создать: `src/utils/handlers/withErrorHandler.ts`
- Применить: во всех хендлерах через фабрику

---

## Порядок выполнения

| Шаг | Описание | Зависимости | Сложность |
|-----|----------|-------------|-----------|
| 1 | Навигационный стек в отдельный модуль | -- | Низкая |
| 2 | Разбить handlers.ts | Шаг 1 | Средняя |
| 3 | Убрать дублирование generateGroupScheduleMessage | -- | Низкая |
| 4 | Убрать лишние npm-пакеты | -- | Низкая |
| 5 | Валидация API (Zod) | -- | Средняя |
| 6 | Типизировать кнопки | -- | Низкая |
| 7 | Исправить тип AdminRow | -- | Низкая |
| 8 | Централизовать ошибки | Шаг 2 | Низкая |

Шаги 1, 3, 4, 5, 6, 7 -- независимые, можно делать параллельно.
Шаг 2 зависит от шага 1. Шаг 8 зависит от шага 2.

---

## Верификация

После каждого шага:
1. `npm run build` -- проект компилируется без ошибок
2. `npm run dev` -- бот запускается, отвечает на /start
3. Проверить навигацию: /start -> Новичок -> Расписание -> группа -> Назад (весь стек)
4. Проверить админ-панель: открывается, CRUD групп работает
5. После шага 5: отправить невалидные данные на API -- ожидаем 400

---

## Что НЕ входит в этот рефакторинг

- Добавление тестов (отдельная задача, после рефакторинга будет проще)
- Персистентность навигационного стека в БД (отдельная фича)
- i18n / мультиязычность
- Рассылка (broadcast)
- Миграция buttons.ts в БД (пока не нужно -- статическая навигация стабильна)
