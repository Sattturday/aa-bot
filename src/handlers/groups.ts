import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { getAaGroups, getGroupScheduleKeys } from '../db/dataProvider';
import { withErrorHandler } from '../utils/handlers/withErrorHandler';
import { addToHistory } from '../utils/history';
import { pushToStack } from '../utils/navigationStack';
import { handleGroupInfo } from '../utils/utils';

export function registerGroupHandlers(bot: Telegraf<Context<Update>>): void {
  const groupKeys = getGroupScheduleKeys();
  groupKeys.forEach(key => {
    bot.action(key, withErrorHandler({
      label: `action:${key}`,
      handler: async ctx => {
        await ctx.answerCbQuery();
        const userId = (ctx.from?.id || 0).toString();
        const firstName = ctx.from?.first_name || '';
        const lastName = ctx.from?.last_name || '';
        const username = ctx.from?.username || '';
        pushToStack(userId, 'group_schedule');
        addToHistory(userId, key, firstName, lastName, username);

        await handleGroupInfo(ctx, key, getAaGroups());
      },
    }));
  });

  // Catch-all для динамических групп, добавленных через админ-панель после запуска бота
  bot.action(/^group_/, withErrorHandler({
    label: 'action:group_dynamic',
    handler: async ctx => {
      await ctx.answerCbQuery();
      const key = ctx.match!.input;
      const userId = (ctx.from?.id || 0).toString();
      const firstName = ctx.from?.first_name || '';
      const lastName = ctx.from?.last_name || '';
      const username = ctx.from?.username || '';
      pushToStack(userId, 'group_schedule');
      addToHistory(userId, key, firstName, lastName, username);

      await handleGroupInfo(ctx, key, getAaGroups());
    },
  }));
}
