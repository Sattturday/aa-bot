import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { registerCategory } from './factory';

export function registerRelativeHandlers(bot: Telegraf<Context<Update>>): void {
  registerCategory({
    bot,
    category: 'relative',
    keys: buttonKeys.relative,
    keyMapper: key => {
      if (key === 'relative_about_aa') {
        return { actionKey: key.slice(9) };
      }
      return { actionKey: key };
    },
  });
}
