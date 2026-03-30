# Контракт: Типы навигации

## Экспорт из `src/data/buttonKeys.ts`

```ts
export const buttonKeys = {
  start: ['welcome'],
  welcome: ['newbie', 'participant', 'relative', 'ask_question'],
  // ... остальные ключи
} as const;

export type ScreenKey = keyof typeof buttonKeys;
export type ButtonKey = typeof buttonKeys[keyof typeof buttonKeys][number];
```

## Контракт использования

### buttons.ts

```ts
type Buttons = Record<ScreenKey | ButtonKey, ButtonRow[]>;
```

Допускаются ключи:
- Любой ключ из `buttonKeys` (`ScreenKey`)
- Любое значение из массивов `buttonKeys` (`ButtonKey`)

### handlers/types.ts (RegisterCategoryOptions)

```ts
interface RegisterCategoryOptions {
  bot: Telegraf<Context<Update>>;
  category: ScreenKey;
  keys: readonly ButtonKey[];
  keyMapper: (key: ButtonKey) => KeyMapResult;
}

interface KeyMapResult {
  actionKey: ScreenKey | ButtonKey;
  imageUrl?: string;
}
```

### utils/utils.ts

```ts
handleButtonAction(ctx: Context, key: ScreenKey | ButtonKey): Promise<void>
handleButtonActionWithImage(ctx: Context, key: ScreenKey | ButtonKey, imageUrl: string): Promise<void>
```

## Исключения (остаются string)

- Динамические ключи групп: `group_*` — обрабатываются regex в `handlers/groups.ts`
- Навигационный стек: `pushToStack(userId: string, state: string)` — хранит любые ключи
- Кнопка `'back'` — callback-данные, не типизированный экран
