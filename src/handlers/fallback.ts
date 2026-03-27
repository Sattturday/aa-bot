import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { getUrlValue } from '../db/dataProvider';
import { addToHistory } from '../utils/history';
import { sendWelcomeMessage } from '../utils/utils';

export function registerFallbackHandlers(bot: Telegraf<Context<Update>>): void {
  // Заглушка для недоступных кнопок
  bot.action('no_action', async ctx => {
    await ctx.answerCbQuery('Пока недоступно');
  });

  // Обработка текстовых сообщений
  bot.on('text', async ctx => {
    const userId = (ctx.from?.id || 0).toString();
    const firstName = ctx.from?.first_name || '';
    const lastName = ctx.from?.last_name || '';
    const username = ctx.from?.username || '';
    addToHistory(userId, 'text: ' + ctx.message.text, firstName, lastName, username);

    try {
      await sendWelcomeMessage(ctx);
    } catch (error) {
      console.error('Ошибка при обработке текстового сообщения:', error);
    }
  });

  // Обработка всех других сообщений
  bot.on('message', async ctx => {
    const userId = (ctx.from?.id || 0).toString();
    const firstName = ctx.from?.first_name || '';
    const lastName = ctx.from?.last_name || '';
    const username = ctx.from?.username || '';
    addToHistory(userId, 'unknown_message', firstName, lastName, username);

    try {
      await ctx.reply(
        `🤔 Я пока не могу обработать это сообщение.

Но я могу помочь вам вернуться в главное меню или связаться с участником АА (алкоголиком, который не пьет).

Выберите, пожалуйста, подходящий вариант:`,
        Markup.inlineKeyboard([
          [Markup.button.callback('🏠 Главное меню', 'back')],
          [Markup.button.url('💬 Связаться с участником АА', getUrlValue('question'))],
        ]),
      );
    } catch (error) {
      console.error('Ошибка при обработке неизвестного сообщения:', error);
    }
  });
}
