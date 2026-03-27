import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { registerCategory } from './factory';

export function registerFaqHandlers(bot: Telegraf<Context<Update>>): void {
  registerCategory({
    bot,
    category: 'faq',
    keys: buttonKeys.faq,
    keyMapper: key => ({ actionKey: key }),
  });
}
