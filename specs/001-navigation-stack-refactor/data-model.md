# Модель данных: Навигационный стек

**Ветка**: `001-navigation-stack-refactor` | **Дата**: 2026-03-27

## Модуль `src/utils/navigationStack.ts`

### Приватное состояние

```typescript
const MAX_NAV_USERS = 10000;
let userNavigationStack: { [userId: string]: string[] } = {};
```

| Поле | Тип | Описание |
|---|---|---|
| `MAX_NAV_USERS` | `number` (константа) | Максимальное количество пользователей в стеке одновременно |
| `userNavigationStack` | `{ [userId: string]: string[] }` | Словарь: userId → список посещённых экранов (LIFO-порядок) |

### Приватная вспомогательная функция

```typescript
function trimNavigationStack(): void
```

Удаляет первую половину записей, когда количество пользователей превышает `MAX_NAV_USERS`. Вызывается внутри `pushToStack`.

### Публичный API модуля

```typescript
export function pushToStack(userId: string, state: string): void
export function popFromStack(userId: string): string | null
export function clearUserNavigationStack(userId: string): void
```

| Функция | Параметры | Возврат | Поведение |
|---|---|---|---|
| `pushToStack` | `userId: string`, `state: string` | `void` | Добавляет `state` в стек пользователя; создаёт запись если не существует; вызывает `trimNavigationStack()` |
| `popFromStack` | `userId: string` | `string \| null` | Извлекает последний элемент стека; возвращает `null` если стек пуст |
| `clearUserNavigationStack` | `userId: string` | `void` | Удаляет всю запись пользователя из `userNavigationStack` |

## Инварианты

- Порядок LIFO: `push('a'); push('b'); pop()` → `'b'`
- Ограничение по размеру: после добавления, если `Object.keys(userNavigationStack).length > 10000`, удаляются самые старые записи
- `popFromStack` на пустом/несуществующем стеке возвращает `null` (не выбрасывает исключение)
- Состояние хранится в памяти процесса; при перезапуске бота стеки очищаются
