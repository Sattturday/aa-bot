import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { getUrlValue } from '../db/dataProvider';
import { registerCategory } from './factory';

export function registerParticipantHandlers(bot: Telegraf<Context<Update>>): void {
  registerCategory({
    bot,
    category: 'participant',
    keys: buttonKeys.participant,
    keyMapper: key => {
      if (key === 'participant_group_schedule') {
        return { actionKey: 'group_schedule', imageUrl: getUrlValue('group_schedule') };
      }
      if (key === 'participant_literature') {
        return { actionKey: key.slice(12) };
      }
      return { actionKey: key };
    },
  });
}
