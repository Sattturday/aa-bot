# Quickstart: Централизация текстов через i18n-слой

## Подготовка

1. Переключиться на ветку `008-centralize-i18n-texts`.
2. Убедиться, что локальная БД доступна в `data/bot.db`.
3. Проверить обязательные переменные окружения (`BOT_TOKEN`, `TG_ID`, `WEBAPP_URL`, `JWT_SECRET`, `ADMIN_IDS`).

## Шаги реализации

1. Создать `src/i18n/messages.ts`, `src/i18n/types.ts`, `src/i18n/index.ts` с публичной функцией `t(key)`.
2. Определить типизированные ключи каталога и гарантировать compile-time ошибку для неизвестных ключей.
3. Реализовать порядок разрешения: runtime-значение из data provider → локальный каталог → safe fallback (возврат ключа + лог).
4. Заменить пользовательские строки в `src/handlers/*` и `src/utils/utils.ts` на вызовы `t(key)`.
5. Убедиться, что существующие динамические тексты (например, расписание групп) используют `t(key)` только для статических фрагментов.
6. Добавить/обновить тесты резолвера и интеграционный сценарий базовых экранов.

## Карта миграции (выполнено)

1. `src/handlers/start.ts` → `t('start_greeting_prefix')`, `t('start_greeting_suffix')`, `t('start')`
2. `src/handlers/admin.ts` → `t('admin_access_denied')`, `t('admin_open_panel')`, `t('admin_panel_button')`, `t('admin_not_configured')`
3. `src/handlers/fallback.ts` → `t('fallback_no_action')`, `t('fallback_unknown_message')`, `t('fallback_main_menu_button')`, `t('fallback_contact_button')`
4. `src/utils/utils.ts` → `t('welcome_menu_prompt')`, `t('group_not_found')`, `t('group_map_view')`, `t('group_video_view')`, `t('common_back_button')` и related fallback-ключи
5. `src/utils/handlers/withErrorHandler.ts` → дефолт из `messageCatalog.handler_error_default`

## Проверка

1. Запустить `npm test`.
2. Запустить `npm run build`.
3. Запустить `cd admin && npm run build`.
4. Запустить `cd admin && npm run lint`.
5. Пройти ручной smoke-test:
   - `/start` и стартовое меню
   - переход по основным кнопкам
   - сценарий отсутствующего ключа (временное удаление значения) и проверка fallback-лога

## Критерии приёмки в разработке

- В `handlers` и `utils` нет пользовательских литеральных сообщений, кроме явно динамически формируемых значений из данных.
- Обращение к невалидному ключу не проходит проверку проекта.
- При отсутствии значения пользователь получает безопасный ответ, а система фиксирует диагностику.

## Фактический статус проверок

- `npm run build` — ✅ проходит
- `npm test` — ✅ проходит (добавлена очистка `dist-tests` перед запуском, чтобы не выполнялись устаревшие удалённые тесты)
- `cd admin && npm run build` — ✅ проходит
- `cd admin && npm run lint` — ❌ падает на предсуществующих `no-explicit-any` и `react-hooks/exhaustive-deps` в `admin/src/pages/*`, вне scope задачи 008
