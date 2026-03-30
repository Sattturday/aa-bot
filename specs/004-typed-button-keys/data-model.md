# Модель данных: Типы навигации

## Типы

### ScreenKey

Объединение всех ключей объекта `buttonKeys`. Выводится автоматически.

```ts
type ScreenKey = keyof typeof buttonKeys;
// = 'start' | 'welcome' | 'newbie' | 'about_aa' | 'participant' |
//   'relative' | 'faq' | 'group_schedule'
```

### ButtonKey

Объединение всех значений массивов внутри `buttonKeys`. Выводится автоматически.

```ts
type ButtonKey = typeof buttonKeys[keyof typeof buttonKeys][number];
// = 'welcome' | 'newbie' | 'participant' | 'relative' | 'ask_question' |
//   'want_to_quit' | 'newbie_about_aa' | ... | 'group_irek'
```

### Навигационный ключ (для buttons.ts)

Экраны в `buttons.ts` индексируются по `ScreenKey | ButtonKey` — каждый экран может быть как родительским (ключ в buttonKeys), так и листовым (значение в массивах).

Примечание: `buttons.ts` содержит дополнительные экраны, не присутствующие как ключи в `buttonKeys` (например, `literature`, `ask_question`, `want_to_quit` и т.д.). Они являются `ButtonKey`.

## Изменяемые файлы и типы

| Файл | Текущий тип | Новый тип |
|------|-------------|-----------|
| `buttonKeys.ts` | `object` | `as const` (буквальный тип) |
| `buttons.ts` | `Record<string, ButtonRow[]>` | `Record<ScreenKey \| ButtonKey, ButtonRow[]>` |
| `handlers/types.ts` → `KeyMapResult.actionKey` | `string` | `ScreenKey \| ButtonKey` |
| `handlers/types.ts` → `RegisterCategoryOptions.category` | `string` | `ScreenKey` |
| `handlers/types.ts` → `RegisterCategoryOptions.keys` | `string[]` | `readonly ButtonKey[]` |
| `handlers/types.ts` → `keyMapper` | `(key: string) => ...` | `(key: ButtonKey) => ...` |
| `utils/utils.ts` → `handleButtonAction.key` | `string` | `ScreenKey \| ButtonKey` |
| `utils/utils.ts` → `handleButtonActionWithImage.key` | `string` | `ScreenKey \| ButtonKey` |
| `navigationStack.ts` | `state: string` | Без изменений (`string`) |

## Не изменяемые файлы

| Файл | Причина |
|------|---------|
| `handlers/groups.ts` | Динамические ключи групп (`group_*`) — остаются `string` |
| `navigationStack.ts` | Стек хранит произвольные ключи включая динамические |
| `handlers/back.ts` | Обрабатывает `'back'` — не типизированный экран |
| `handlers/admin.ts` | Служебные обработчики, не связанные с навигацией |
