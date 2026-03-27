# Контракт: Фабрика регистрации обработчиков

**Module**: `src/handlers/factory.ts`
**Date**: 2026-03-27

## Интерфейс

### `KeyMapResult`

```typescript
interface KeyMapResult {
  actionKey: string;   // ключ экрана для handleButtonAction или handleButtonActionWithImage
  imageUrl?: string;   // если задан — вызывается handleButtonActionWithImage
}
```

### `RegisterCategoryOptions`

```typescript
interface RegisterCategoryOptions {
  bot: Telegraf<Context<Update>>;
  category: string;
  keys: string[];
  keyMapper: (key: string) => KeyMapResult;
}
```

### `registerCategory`

```typescript
function registerCategory(options: RegisterCategoryOptions): void
```

**Поведение:**
1. Для каждого ключа из `options.keys` регистрирует `bot.action(key, handler)`
2. Каждый handler:
   - вызывает `ctx.answerCbQuery()`
   - получает `userId` из `ctx.from.id`
   - вызывает `pushToStack(userId, options.category)`
   - вызывает `addToHistory(...)` для трекинга
   - получает `{ actionKey, imageUrl }` через `options.keyMapper(key)`
   - если `imageUrl` — вызывает `handleButtonActionWithImage(ctx, actionKey, imageUrl)`
   - иначе — вызывает `handleButtonAction(ctx, actionKey)`
   - оборачивает всё в try/catch с `console.error` при ошибке

**Гарантии:**
- Если `options.keys` пустой — ничего не регистрируется, исключений нет
- `keyMapper` вызывается единожды на событие кнопки, не при регистрации
- Ошибка внутри одного обработчика не влияет на другие

## Оркестратор

### `registerAllHandlers`

```typescript
// src/handlers/index.ts
function registerAllHandlers(bot: Telegraf<Context<Update>>): void
```

**Заменяет**: `registerButtonHandlers` из `src/utils/handlers.ts`

**Порядок регистрации** (важен для Telegraf):
1. `no_action` заглушка
2. `/start` команда
3. Категориальные обработчики (start, welcome, newbie, participant, faq, about_aa, relative)
4. Статические группы + динамический catch-all `/^group_/`
5. `back`
6. `admin_panel`
7. Fallback: `bot.on('text')`, `bot.on('message')`
