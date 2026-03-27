# Быстрый старт: Рефакторинг навигационного стека

**Ветка**: `001-navigation-stack-refactor` | **Дата**: 2026-03-27

## Что меняется

Логика навигационного стека переносится из `src/index.ts` в `src/utils/navigationStack.ts`.

## Новый модуль

```typescript
// src/utils/navigationStack.ts
import { pushToStack, popFromStack, clearUserNavigationStack } from './navigationStack';
```

## Изменение импортов

**До** (в `src/utils/handlers.ts`):
```typescript
import { pushToStack, popFromStack, clearUserNavigationStack } from '..';
```

**После**:
```typescript
import { pushToStack, popFromStack, clearUserNavigationStack } from './navigationStack';
```

## Проверка

После применения изменений:
1. `grep -r "pushToStack\|popFromStack\|clearUserNavigationStack" src/index.ts` — должно вернуть 0 результатов
2. `npm run build` — должен компилироваться без ошибок
3. Ручная проверка: `/start → кнопка → назад` — навигация работает корректно
