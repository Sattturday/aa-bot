import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { getUrlValue } from '../db/dataProvider';
import { mapButtonKeyToMessageKey } from '../i18n';
import { registerCategory } from './factory';

export function registerNewbieHandlers(bot: Telegraf<Context<Update>>): void {
  registerCategory({
    bot,
    category: 'newbie',
    keys: buttonKeys.newbie,
    keyMapper: key => {
      const actionKey = mapButtonKeyToMessageKey(key);
      if (!actionKey) {
        throw new Error(`Missing message mapping for button key: ${key}`);
      }

      if (key === 'newbie_group_schedule') {
        return { actionKey, imageUrl: getUrlValue('group_schedule') };
      }
      return { actionKey };
    },
  });
}
