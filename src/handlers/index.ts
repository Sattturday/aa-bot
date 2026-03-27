import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { registerFallbackHandlers } from './fallback';
import { registerStartHandlers } from './start';
import { registerWelcomeHandlers } from './welcome';
import { registerNewbieHandlers } from './newbie';
import { registerParticipantHandlers } from './participant';
import { registerFaqHandlers } from './faq';
import { registerAboutAaHandlers } from './about_aa';
import { registerRelativeHandlers } from './relative';
import { registerGroupHandlers } from './groups';
import { registerBackHandler } from './back';
import { registerAdminHandler } from './admin';

/**
 * Регистрирует все обработчики Telegram-бота.
 *
 * Порядок регистрации важен для Telegraf: более специфичные обработчики
 * (конкретные action-ключи) должны идти до универсальных (regex, on('message')).
 * Fallback-обработчики регистрируются последними.
 *
 * Args:
 *   bot: Экземпляр Telegraf-бота.
 */
export function registerAllHandlers(bot: Telegraf<Context<Update>>): void {
  registerStartHandlers(bot);
  registerWelcomeHandlers(bot);
  registerNewbieHandlers(bot);
  registerParticipantHandlers(bot);
  registerFaqHandlers(bot);
  registerAboutAaHandlers(bot);
  registerRelativeHandlers(bot);
  registerGroupHandlers(bot);
  registerBackHandler(bot);
  registerAdminHandler(bot);
  registerFallbackHandlers(bot);
}
