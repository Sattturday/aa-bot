import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { getAaGroups, getGroupScheduleKeys } from '../db/dataProvider';
import { addToHistory } from '../utils/history';
import { pushToStack } from '../utils/navigationStack';
import { handleGroupInfo } from '../utils/utils';

export function registerGroupHandlers(bot: Telegraf<Context<Update>>): void {
  const groupKeys = getGroupScheduleKeys();
  groupKeys.forEach(key => {
    bot.action(key, async ctx => {
      try {
        await ctx.answerCbQuery();
        const userId = (ctx.from?.id || 0).toString();
        const firstName = ctx.from?.first_name || '';
        const lastName = ctx.from?.last_name || '';
        const username = ctx.from?.username || '';
        pushToStack(userId, 'group_schedule');
        addToHistory(userId, key, firstName, lastName, username);

        await handleGroupInfo(ctx, key, getAaGroups());
      } catch (error) {
        console.error(`Ошибка при регистрации обработчика для кнопки ${key}:`, error);
      }
    });
  });

  // Catch-all для динамических групп, добавленных через админ-панель после запуска бота
  bot.action(/^group_/, async ctx => {
    try {
      await ctx.answerCbQuery();
      const key = ctx.match[0];
      const userId = (ctx.from?.id || 0).toString();
      const firstName = ctx.from?.first_name || '';
      const lastName = ctx.from?.last_name || '';
      const username = ctx.from?.username || '';
      pushToStack(userId, 'group_schedule');
      addToHistory(userId, key, firstName, lastName, username);

      await handleGroupInfo(ctx, key, getAaGroups());
    } catch (error) {
      console.error('Ошибка при обработке динамической группы:', error);
    }
  });
}
