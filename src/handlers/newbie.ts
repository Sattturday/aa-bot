import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { getUrlValue } from '../db/dataProvider';
import { registerCategory } from './factory';

export function registerNewbieHandlers(bot: Telegraf<Context<Update>>): void {
  registerCategory({
    bot,
    category: 'newbie',
    keys: buttonKeys.newbie,
    keyMapper: key => {
      if (key === 'newbie_group_schedule') {
        return { actionKey: 'group_schedule', imageUrl: getUrlValue('group_schedule') };
      }
      if (key === 'newbie_about_aa' || key === 'newbie_literature') {
        return { actionKey: key.slice(7) };
      }
      return { actionKey: key };
    },
  });
}
