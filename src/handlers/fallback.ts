import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { getUrlValue } from '../db/dataProvider';
import { withErrorHandler } from '../utils/handlers/withErrorHandler';
import { addToHistory } from '../utils/history';
import { sendWelcomeMessage } from '../utils/utils';

export function registerFallbackHandlers(bot: Telegraf<Context<Update>>): void {
  // Заглушка для недоступных кнопок
  bot.action('no_action', withErrorHandler({
    label: 'action:no_action',
    handler: async ctx => {
      await ctx.answerCbQuery('Пока недоступно');
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

      await ctx.reply(
        `🤔 Я пока не могу обработать это сообщение.

Но я могу помочь вам вернуться в главное меню или связаться с участником АА (алкоголиком, который не пьет).

Выберите, пожалуйста, подходящий вариант:`,
        Markup.inlineKeyboard([
          [Markup.button.callback('🏠 Главное меню', 'back')],
          [Markup.button.url('💬 Связаться с участником АА', getUrlValue('question'))],
        ]),
      );
    },
  }));
}
