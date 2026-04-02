import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { getUrlValue } from '../db/dataProvider';
import { mapButtonKeyToMessageKey } from '../i18n';
import { registerCategory } from './factory';

export function registerParticipantHandlers(bot: Telegraf<Context<Update>>): void {
  registerCategory({
    bot,
    category: 'participant',
    keys: buttonKeys.participant,
    keyMapper: key => {
      const actionKey = mapButtonKeyToMessageKey(key);
      if (!actionKey) {
        throw new Error(`Missing message mapping for button key: ${key}`);
      }

      if (key === 'participant_group_schedule') {
        return { actionKey, imageUrl: getUrlValue('group_schedule') };
      }
      return { actionKey };
    },
  });
}
