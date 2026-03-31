import { Context } from 'telegraf';

/**
 * Базовый тип Telegram-хендлера, совместимый с обёрткой ошибок.
 *
 * Args:
 *   ctx: Контекст Telegraf.
 *
 * Returns:
 *   Результат выполнения хендлера.
 */
export type TelegramHandler<TContext extends Context = Context> = (
  ctx: TContext,
) => Promise<unknown> | unknown;

/**
 * Параметры общей обёртки обработки ошибок.
 *
 * Args:
 *   label: Контекст ошибки для логирования.
 *   handler: Исходный хендлер.
 *   fallbackMessage: Пользовательское fallback-сообщение.
 */
export interface WithErrorHandlerOptions<TContext extends Context = Context> {
  label: string;
  handler: TelegramHandler<TContext>;
  fallbackMessage?: string;
}

/**
 * Нормализованная структура записи ошибки.
 *
 * Args:
 *   label: Контекст обработчика.
 *   userId: Идентификатор пользователя, если доступен.
 *   stage: Этап возникновения ошибки.
 *   error: Исходный объект ошибки.
 */
export interface LoggedHandlerError {
  label: string;
  userId: string | null;
  stage: 'handler' | 'fallback';
  error: unknown;
}
