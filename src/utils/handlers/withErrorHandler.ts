import { Context } from 'telegraf';
import { messageCatalog } from '../../i18n/messages';
import {
  LoggedHandlerError,
  WithErrorHandlerOptions,
} from './types';

export const DEFAULT_HANDLER_ERROR_MESSAGE =
  messageCatalog.handler_error_default;

function getUserId(ctx: Context): string | null {
  if (!ctx.from?.id) {
    return null;
  }

  return ctx.from.id.toString();
}

function logHandlerError(entry: LoggedHandlerError): void {
  console.error('[handler-error]', entry);
}

/**
 * Оборачивает Telegram-хендлер единым сценарием обработки ошибок.
 *
 * Args:
 *   options: Параметры обёртки.
 *
 * Returns:
 *   Новый хендлер с централизованным логированием и fallback-ответом.
 */
export function withErrorHandler<TContext extends Context = Context>(
  options: WithErrorHandlerOptions<TContext>,
): (ctx: TContext) => Promise<void> {
  const {
    label,
    handler,
    fallbackMessage = DEFAULT_HANDLER_ERROR_MESSAGE,
  } = options;

  return async (ctx: TContext): Promise<void> => {
    try {
      await handler(ctx);
    } catch (error) {
      const userId = getUserId(ctx);

      logHandlerError({
        label,
        userId,
        stage: 'handler',
        error,
      });

      try {
        await ctx.reply(fallbackMessage);
      } catch (fallbackError) {
        logHandlerError({
          label,
          userId,
          stage: 'fallback',
          error: fallbackError,
        });
      }
    }
  };
}
