import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { isAdmin } from '../db/adminsRepo';
import { t } from '../i18n';
import { withErrorHandler } from '../utils/handlers/withErrorHandler';
import { addToHistory } from '../utils/history';

export function registerAdminHandler(bot: Telegraf<Context<Update>>): void {
  bot.action('admin_panel', withErrorHandler({
    label: 'action:admin_panel',
    handler: async ctx => {
      const userId = (ctx.from?.id || 0).toString();
      if (!isAdmin(userId)) {
        await ctx.answerCbQuery(t('admin_access_denied'));
        return;
      }
      const firstName = ctx.from?.first_name || '';
      const lastName = ctx.from?.last_name || '';
      const username = ctx.from?.username || '';
      addToHistory(userId, 'admin_panel', firstName, lastName, username);
      const webAppUrl = process.env.WEBAPP_URL;
      if (webAppUrl) {
        await ctx.reply(t('admin_open_panel'), Markup.inlineKeyboard([
          [Markup.button.webApp(t('admin_panel_button'), webAppUrl)],
        ]));
      } else {
        await ctx.reply(t('admin_not_configured'));
      }
    },
  }));
}
