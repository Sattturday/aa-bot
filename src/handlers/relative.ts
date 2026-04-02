import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { mapButtonKeyToMessageKey } from '../i18n';
import { registerCategory } from './factory';

export function registerRelativeHandlers(bot: Telegraf<Context<Update>>): void {
  registerCategory({
    bot,
    category: 'relative',
    keys: buttonKeys.relative,
    keyMapper: key => {
      const actionKey = mapButtonKeyToMessageKey(key);
      if (!actionKey) {
        throw new Error(`Missing message mapping for button key: ${key}`);
      }
      return { actionKey };
    },
  });
}
