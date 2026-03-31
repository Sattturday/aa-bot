import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { withErrorHandler } from '../utils/handlers/withErrorHandler';
import { addToHistory } from '../utils/history';
import { popFromStack, clearUserNavigationStack } from '../utils/navigationStack';
import { handleButtonAction, sendWelcomeMessage } from '../utils/utils';

export function registerBackHandler(bot: Telegraf<Context<Update>>): void {
  bot.action('back', withErrorHandler({
    label: 'action:back',
    handler: async ctx => {
      await ctx.answerCbQuery();
      const userId = (ctx.from?.id || 0).toString();
      const firstName = ctx.from?.first_name || '';
      const lastName = ctx.from?.last_name || '';
      const username = ctx.from?.username || '';
      const previousState = popFromStack(userId);
      addToHistory(userId, 'back', firstName, lastName, username);

      if (previousState) {
        if (previousState === 'welcome') {
          await ctx.deleteMessage();
          clearUserNavigationStack(userId);
          await sendWelcomeMessage(ctx);
        } else {
          await handleButtonAction(ctx, previousState);
        }
      } else {
        await ctx.deleteMessage();
        await sendWelcomeMessage(ctx);
      }
    },
  }));
}
