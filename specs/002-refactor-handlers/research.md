# Research: Рефакторинг обработчиков Telegram

**Branch**: `002-refactor-handlers` | **Date**: 2026-03-27

## Исследование 1: Текущая структура handlers.ts

**Decision**: Файл `src/utils/handlers.ts` (333 строки) содержит 8 категорий обработчиков кнопок + /start + back + admin + fallback. Паттерн регистрации повторяется ~6 раз с минимальными вариациями.

**Rationale**: Точно идентифицированы все места дублирования перед декомпозицией.

**Alternatives considered**: Нет — анализ существующего кода однозначен.

---

## Исследование 2: Типы KeyMapper

**Decision**: Три категории имеют нестандартный маппинг ключей:
- `newbie`: `newbie_group_schedule` → `group_schedule` + imageUrl; `newbie_about_aa` → `about_aa`; `newbie_literature` → `literature`
- `participant`: `participant_group_schedule` → `group_schedule` + imageUrl; `participant_literature` → `literature`
- `relative`: `relative_about_aa` → `about_aa`

Остальные категории (welcome, faq, about_aa, faq) используют прямой маппинг `key → key`.

**Rationale**: KeyMapper должен возвращать `{ actionKey: string; imageUrl?: string }`. Если `imageUrl` присутствует — используется `handleButtonActionWithImage`, иначе `handleButtonAction`.

**Alternatives considered**:
- Хранить логику маппинга прямо в фабрике — отклонено (смешивает ответственности)
- Передавать два отдельных параметра (`keyMapper` + `imageUrlMapper`) — отклонено (усложняет интерфейс без пользы)

---

## Исследование 3: Сигнатура фабрики

**Decision**: Согласно Конституции XI (именованные аргументы при 4+ параметрах), фабрика использует объект:

```typescript
interface RegisterCategoryOptions {
  bot: Telegraf<Context<Update>>;
  category: string;         // ключ состояния, который пушится в стек
  keys: string[];           // список action-ключей
  keyMapper: (key: string) => { actionKey: string; imageUrl?: string };
}
```

**Rationale**: 4 параметра → обязательно объект (Конституция XI). Делает вызовы самодокументируемыми.

**Alternatives considered**: Позиционные параметры — отклонено (нарушает Конституцию XI).

---

## Исследование 4: Импорт в index.ts

**Decision**: В `src/index.ts` вызов `registerButtonHandlers(bot)` заменяется на `registerAllHandlers(bot)` из `src/handlers/index.ts`. Старый файл `src/utils/handlers.ts` удаляется.

**Rationale**: Единственный потребитель — `src/index.ts` (строка 6). Замена одного импорта.

**Alternatives considered**: Оставить `handlers.ts` как реэкспорт-обёртку — отклонено (нарушает требование FR-006 из спецификации).

---

## Исследование 5: Проверка Конституции IX (Тестирование)

**Decision**: Фабрика `registerCategory` — это инфраструктурный код регистрации, а не бизнес-логика. CLAUDE.md подтверждает: "No test framework is configured." Юнит-тесты для фабрики не пишутся в рамках данной задачи; проверка выполняется через запуск бота.

**Rationale**: Конституция IX допускает не покрывать "простые обработчики, если не содержат логики". Рефакторинг не добавляет новую бизнес-логику, только перераспределяет существующую. Если позднее добавить тест-фреймворк — фабрика станет первым кандидатом на покрытие.

**Alternatives considered**: Добавить jest/vitest — выходит за рамки задачи (Конституция V: не усложнять сверх запрошенного).

---

## Итоговые решения

| Вопрос | Решение |
|--------|---------|
| Сигнатура фабрики | Объект-параметр (Конституция XI) |
| Тип KeyMapper | `(key: string) => { actionKey: string; imageUrl?: string }` |
| Файловая структура | 13 файлов в `src/handlers/` |
| Удаление handlers.ts | Да, полностью (FR-006) |
| Тесты | Ручная проверка (нет test-фреймворка) |
| Переименование точки входа | `registerButtonHandlers` → `registerAllHandlers` |
