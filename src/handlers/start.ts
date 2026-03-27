import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttons } from '../data/buttons';
import { buttonKeys } from '../data/buttonKeys';
import { getUrlValue, getMessageText } from '../db/dataProvider';
import { addToHistory } from '../utils/history';
import { pushToStack } from '../utils/navigationStack';
import { sendWelcomeMessage } from '../utils/utils';

export function registerStartHandlers(bot: Telegraf<Context<Update>>): void {
  bot.start(async ctx => {
    const firstName = ctx.from?.first_name || 'друг';
    const userId = (ctx.from?.id || 0).toString();
    const lastName = ctx.from?.last_name || '';
    const username = ctx.from?.username || '';
    const message = `👋 Привет, ${firstName}!`;
    const keyboard = Markup.inlineKeyboard(buttons.start).reply_markup;

    addToHistory(userId, '/start', firstName, lastName, username);

    await ctx.replyWithPhoto(
      { url: getUrlValue('welcome') },
      {
        caption: message + getMessageText('start'),
        reply_markup: keyboard,
      },
    );
  });

  buttonKeys.start.forEach(key => {
    bot.action(key, async ctx => {
      try {
        await ctx.answerCbQuery();
        const userId = (ctx.from?.id || 0).toString();
        const firstName = ctx.from?.first_name || '';
        const lastName = ctx.from?.last_name || '';
        const username = ctx.from?.username || '';
        pushToStack(userId, 'start');
        addToHistory(userId, key, firstName, lastName, username);

        await ctx.deleteMessage();
        await sendWelcomeMessage(ctx);
      } catch (error) {
        console.error(`Ошибка при регистрации обработчика для кнопки ${key}:`, error);
      }
    });
  });
}
