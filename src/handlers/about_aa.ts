import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { registerCategory } from './factory';

export function registerAboutAaHandlers(bot: Telegraf<Context<Update>>): void {
  registerCategory({
    bot,
    category: 'about_aa',
    keys: buttonKeys.about_aa,
    keyMapper: key => ({ actionKey: key }),
  });
}
