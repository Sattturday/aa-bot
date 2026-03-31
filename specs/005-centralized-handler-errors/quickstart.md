# Quickstart: Централизованная обработка ошибок в Telegram-хендлерах

## Подготовка

1. Перейти на ветку `005-centralized-handler-errors`.
2. Убедиться, что зависимости установлены.
3. Подготовить тестовую конфигурацию бота (`BOT_TOKEN`, `TG_ID`, `WEBAPP_URL`, `JWT_SECRET`, `ADMIN_IDS`).

## Шаги реализации

1. Создать общий wrapper в `src/utils/handlers/withErrorHandler.ts` и типы в `src/utils/handlers/types.ts`.
2. Подключить wrapper в `src/handlers/factory.ts`, `src/handlers/start.ts`, `src/handlers/groups.ts`, `src/handlers/back.ts`, `src/handlers/admin.ts`, `src/handlers/fallback.ts`.
3. Удалить локальные `try/catch` из Telegram-хендлеров, где они выполняли только стандартное логирование и fallback.
4. Добавить test runner без внешнего test framework через `package.json` и `tsconfig.test.json`.
5. Добавить unit-тесты wrapper в `tests/unit/utils/handlers/withErrorHandler.test.ts`.
6. Добавить integration-style проверки registration path в `tests/integration/handlers/registration-error-flow.test.ts`.

## Проверка

1. Запустить `npm test`.
2. Запустить `npm run build`.
3. Запустить `cd admin && npm run build`.
4. Запустить `cd admin && npm run lint`.
5. Искусственно спровоцировать ошибку в одном из action-хендлеров и проверить:
   - пользователь получает `Произошла ошибка. Попробуйте ещё раз или нажмите /start`
   - в логах есть label и `userId`
   - вторичная ошибка fallback не валит процесс
6. Пройти штатные сценарии `/start`, кнопки навигации, `back`, `admin_panel`, `text/message` fallback без искусственных ошибок.

## Фактический статус

- `npm test` проходит
- `npm run build` проходит
- `cd admin && npm run build` проходит
- `cd admin && npm run lint` сейчас падает на предсуществующих `no-explicit-any` и `react-hooks/exhaustive-deps` в файлах `admin/src/pages/*`; эта фича их не меняет
