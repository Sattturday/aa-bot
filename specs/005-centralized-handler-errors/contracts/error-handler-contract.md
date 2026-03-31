# Контракт: Единая обработка ошибок Telegram-хендлеров

## Цель

Все зарегистрированные Telegram-хендлеры используют одну и ту же схему реакции на ошибку:

1. выполнить пользовательский сценарий;
2. при сбое записать лог с label и userId;
3. попытаться отправить fallback-сообщение;
4. не падать повторно, если fallback тоже завершился ошибкой.

## Контракт wrapper-функции

```ts
type TelegramHandler = (ctx: Context) => Promise<unknown> | unknown;

interface WithErrorHandlerOptions {
  label: string;
  fallbackMessage?: string;
  handler: TelegramHandler;
}

declare function withErrorHandler(
  options: WithErrorHandlerOptions,
): (ctx: Context) => Promise<void>;
```

## Обязательное поведение

- `label` обязателен для каждого вызова.
- Если `handler` завершается успешно, wrapper не выполняет дополнительных действий.
- Если `handler` выбрасывает ошибку, wrapper вызывает единый логгер:

```ts
console.error('[handler-error]', {
  label,
  userId,
  stage: 'handler',
  error,
});
```

- После этого wrapper пытается отправить пользователю fallback:

```ts
await ctx.reply('Произошла ошибка. Попробуйте ещё раз или нажмите /start');
```

- Если fallback-ответ завершается ошибкой, wrapper пишет дополнительный лог:

```ts
console.error('[handler-error]', {
  label,
  userId,
  stage: 'fallback',
  error: fallbackError,
});
```

- Ошибка стадии `fallback` не пробрасывается наружу.

## Контракт интеграции в местах регистрации

### Фабричные action-хендлеры

```ts
bot.action(key, withErrorHandler({
  label: `action:${String(key)}`,
  handler: async ctx => {
    // исходная логика без локального try/catch
  },
}));
```

### Команда `/start`

```ts
bot.start(withErrorHandler({
  label: 'command:start',
  handler: async ctx => {
    // исходная логика старта
  },
}));
```

### Fallback-сценарии

```ts
bot.on('text', withErrorHandler({
  label: 'fallback:text',
  handler: async ctx => {
    // исходная логика fallback
  },
}));
```

## Ограничения контракта

- Wrapper не берёт на себя бизнес-валидацию и не меняет содержимое успешных ответов.
- Wrapper не гарантирует перехват ошибок из асинхронных операций, которые были запущены без `await`.
- Wrapper не заменяет локальный fallback в специальных местах, где нужен отличный от стандартного UX и это явно описано отдельной задачей.
