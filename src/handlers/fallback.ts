import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { getUrlValue } from '../db/dataProvider';
import { t } from '../i18n';
import { withErrorHandler } from '../utils/handlers/withErrorHandler';
import { addToHistory } from '../utils/history';
import { sendWelcomeMessage } from '../utils/utils';

export function registerFallbackHandlers(bot: Telegraf<Context<Update>>): void {
  // Заглушка для недоступных кнопок
  bot.action('no_action', withErrorHandler({
    label: 'action:no_action',
    handler: async ctx => {
      await ctx.answerCbQuery(t('fallback_no_action'));
    },
  }));

  // Обработка текстовых сообщений
  bot.on('text', withErrorHandler({
    label: 'fallback:text',
    handler: async ctx => {
      const userId = (ctx.from?.id || 0).toString();
      const firstName = ctx.from?.first_name || '';
      const lastName = ctx.from?.last_name || '';
      const username = ctx.from?.username || '';
      addToHistory(userId, 'text: ' + ctx.message.text, firstName, lastName, username);

      await sendWelcomeMessage(ctx);
    },
  }));

  // Обработка всех других сообщений
  bot.on('message', withErrorHandler({
    label: 'fallback:message',
    handler: async ctx => {
      const userId = (ctx.from?.id || 0).toString();
      const firstName = ctx.from?.first_name || '';
      const lastName = ctx.from?.last_name || '';
      const username = ctx.from?.username || '';
      addToHistory(userId, 'unknown_message', firstName, lastName, username);

      await ctx.reply(t('fallback_unknown_message'), Markup.inlineKeyboard([
        [Markup.button.callback(t('fallback_main_menu_button'), 'back')],
        [Markup.button.url(t('fallback_contact_button'), getUrlValue('question'))],
      ]));
    },
  }));
}
