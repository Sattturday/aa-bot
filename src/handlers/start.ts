import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttons } from '../data/buttons';
import { buttonKeys } from '../data/buttonKeys';
import { getUrlValue } from '../db/dataProvider';
import { t } from '../i18n';
import { withErrorHandler } from '../utils/handlers/withErrorHandler';
import { addToHistory } from '../utils/history';
import { pushToStack } from '../utils/navigationStack';
import { sendWelcomeMessage } from '../utils/utils';

export function registerStartHandlers(bot: Telegraf<Context<Update>>): void {
  bot.start(withErrorHandler({
    label: 'command:start',
    handler: async ctx => {
    const firstName = ctx.from?.first_name || t('start_default_name');
    const userId = (ctx.from?.id || 0).toString();
    const lastName = ctx.from?.last_name || '';
    const username = ctx.from?.username || '';
    const message = `${t('start_greeting_prefix')}${firstName}${t('start_greeting_suffix')}`;
    const keyboard = Markup.inlineKeyboard(buttons.start).reply_markup;

    addToHistory(userId, '/start', firstName, lastName, username);

    await ctx.replyWithPhoto(
      { url: getUrlValue('welcome') },
      {
        caption: message + t('start'),
        reply_markup: keyboard,
      },
    );
    },
  }));

  buttonKeys.start.forEach(key => {
    bot.action(key, withErrorHandler({
      label: `action:${key}`,
      handler: async ctx => {
        await ctx.answerCbQuery();
        const userId = (ctx.from?.id || 0).toString();
        const firstName = ctx.from?.first_name || '';
        const lastName = ctx.from?.last_name || '';
        const username = ctx.from?.username || '';
        pushToStack(userId, 'start');
        addToHistory(userId, key, firstName, lastName, username);

        await ctx.deleteMessage();
        await sendWelcomeMessage(ctx);
      },
    }));
  });
}
