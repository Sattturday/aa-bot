import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { registerCategory } from './factory';

export function registerWelcomeHandlers(bot: Telegraf<Context<Update>>): void {
  registerCategory({
    bot,
    category: 'welcome',
    keys: buttonKeys.welcome,
    keyMapper: key => ({ actionKey: key }),
  });
}
