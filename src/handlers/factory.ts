import { addToHistory } from '../utils/history';
import { withErrorHandler } from '../utils/handlers/withErrorHandler';
import { pushToStack } from '../utils/navigationStack';
import { handleButtonAction, handleButtonActionWithImage } from '../utils/utils';
import { RegisterCategoryOptions } from './types';

/**
 * Фабрика регистрации обработчиков кнопок для одной категории навигации.
 *
 * Инкапсулирует повторяющийся паттерн: для каждого ключа регистрирует
 * bot.action, внутри которого выполняется стандартная последовательность:
 * подтверждение callback-запроса, добавление в стек навигации, трекинг
 * действия и вызов нужного обработчика отображения.
 *
 * Args:
 *   options: Параметры категории — бот, ключ состояния, список кнопок, маппер.
 *
 * Example:
 *   registerCategory({
 *     bot,
 *     category: 'welcome',
 *     keys: buttonKeys.welcome,
 *     keyMapper: key => ({ actionKey: key }),
 *   });
 */
export function registerCategory(options: RegisterCategoryOptions): void {
  const { bot, category, keys, keyMapper } = options;

  keys.forEach(key => {
    bot.action(key, withErrorHandler({
      label: `action:${key}`,
      handler: async ctx => {
        await ctx.answerCbQuery();

        const userId = (ctx.from?.id || 0).toString();
        const firstName = ctx.from?.first_name || '';
        const lastName = ctx.from?.last_name || '';
        const username = ctx.from?.username || '';

        pushToStack(userId, category);
        addToHistory(userId, key, firstName, lastName, username);

        const { actionKey, imageUrl } = keyMapper(key);

        if (imageUrl) {
          await handleButtonActionWithImage(ctx, actionKey, imageUrl);
        } else {
          await handleButtonAction(ctx, actionKey);
        }
      },
    }));
  });
}
