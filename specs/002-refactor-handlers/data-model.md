# Data Model: Рефакторинг обработчиков Telegram

**Branch**: `002-refactor-handlers` | **Date**: 2026-03-27

> Рефакторинг не изменяет схему данных SQLite. Этот файл описывает программные сущности (типы, интерфейсы) нового кода.

---

## Программные сущности

### `KeyMapResult`

Результат маппинга ключа кнопки в параметры обработчика.

```typescript
interface KeyMapResult {
  actionKey: string;   // ключ экрана для вызова handleButtonAction/WithImage
  imageUrl?: string;   // если задан — используется обработчик с изображением
}
```

### `RegisterCategoryOptions`

Параметры для фабрики регистрации обработчиков категории.

```typescript
interface RegisterCategoryOptions {
  bot: Telegraf<Context<Update>>;
  category: string;                          // состояние, пушимое в стек навигации
  keys: string[];                            // action-ключи кнопок категории
  keyMapper: (key: string) => KeyMapResult;  // маппинг ключа кнопки → экран
}
```

**Ограничения**:
- `keys` не должен быть пустым (если пуст — обработчики не регистрируются, ошибок нет)
- `keyMapper` обязан быть чистой функцией без побочных эффектов
- `category` — произвольная строка (существующий тип `string`, не `NavigationState`, т.к. enum не вводится)

---

## Структура модулей (файловая схема)

```
src/handlers/
├── index.ts          # registerAllHandlers(bot): единая точка входа
├── factory.ts        # registerCategory(options): фабрика
├── start.ts          # /start + buttonKeys.start
├── welcome.ts        # buttonKeys.welcome
├── newbie.ts         # buttonKeys.newbie (кастомный mapper)
├── participant.ts    # buttonKeys.participant (кастомный mapper)
├── faq.ts            # buttonKeys.faq
├── about_aa.ts       # buttonKeys.about_aa
├── relative.ts       # buttonKeys.relative (кастомный mapper)
├── groups.ts         # group_schedule (статические + динамический catch-all)
├── back.ts           # action 'back'
├── admin.ts          # action 'admin_panel'
└── fallback.ts       # bot.on('text') + bot.on('message') + action 'no_action'
```

---

## Маппинг по категориям

| Категория | Тип mapper | Особенности |
|-----------|-----------|-------------|
| welcome | прямой | `key → key` |
| newbie | кастомный | `newbie_group_schedule → group_schedule + imageUrl`; `newbie_about_aa → about_aa`; `newbie_literature → literature` |
| participant | кастомный | `participant_group_schedule → group_schedule + imageUrl`; `participant_literature → literature` |
| faq | прямой | `key → key` |
| about_aa | прямой | `key → key` |
| relative | кастомный | `relative_about_aa → about_aa` |

---

## Изменения публичного интерфейса

| До | После |
|----|-------|
| `registerButtonHandlers(bot)` из `src/utils/handlers.ts` | `registerAllHandlers(bot)` из `src/handlers/index.ts` |

**Единственный потребитель**: `src/index.ts` — требует одного изменения импорта.
