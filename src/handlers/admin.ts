import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { isAdmin } from '../db/adminsRepo';
import { addToHistory } from '../utils/history';

export function registerAdminHandler(bot: Telegraf<Context<Update>>): void {
  bot.action('admin_panel', async ctx => {
    try {
      const userId = (ctx.from?.id || 0).toString();
      if (!isAdmin(userId)) {
        await ctx.answerCbQuery('У вас нет доступа к админ-панели.');
        return;
      }
      const firstName = ctx.from?.first_name || '';
      const lastName = ctx.from?.last_name || '';
      const username = ctx.from?.username || '';
      addToHistory(userId, 'admin_panel', firstName, lastName, username);
      const webAppUrl = process.env.WEBAPP_URL;
      if (webAppUrl) {
        await ctx.reply('Откройте админ-панель:', Markup.inlineKeyboard([
          [Markup.button.webApp('🔧 Админ-панель', webAppUrl)],
        ]));
      } else {
        await ctx.reply('Админ-панель не настроена. Укажите WEBAPP_URL.');
      }
    } catch (error) {
      console.error('Ошибка при открытии админ-панели:', error);
    }
  });
}
