import { Context, Markup } from 'telegraf';
import { getGroupScheduleButtons, getGroupPhone } from '../db/dataProvider';
import { isAdmin } from '../db/adminsRepo';
import { MessageKey, t } from '../i18n';
import { messageCatalog } from '../i18n/messages';
import { GroupWithSchedule } from '../types';
import { buttons } from '../data/buttons';

// Главное меню
export const sendWelcomeMessage = async (ctx: Context) => {
  try {
    const message = t('welcome_menu_prompt');
    const rows = [...buttons.welcome];

    const userId = (ctx.from?.id || 0).toString();
    const webAppUrl = process.env.WEBAPP_URL;
    if (isAdmin(userId) && webAppUrl) {
      rows.push([Markup.button.webApp(t('admin_panel_button'), webAppUrl)]);
    }

    await ctx.reply(message, Markup.inlineKeyboard(rows));
  } catch (error) {
    console.error(messageCatalog.utils_welcome_send_error, error);
  }
};

// Универсальный обработчик для кнопок
export const handleButtonAction = async (ctx: Context, key: MessageKey) => {
  try {
    await ctx.deleteMessage();

    const message = t(key);
    // For group_schedule, use dynamic buttons; otherwise use static
    const keyboard = key === 'group_schedule'
      ? Markup.inlineKeyboard(getGroupScheduleButtons())
      : Markup.inlineKeyboard(buttons[key]);

    await ctx.reply(message, keyboard);
  } catch (error) {
    console.error(`${messageCatalog.utils_button_action_error_prefix} ${key}:`, error);
  }
};

// Универсальный обработчик для кнопок с изображением
export const handleButtonActionWithImage = async (
  ctx: Context,
  key: MessageKey,
  imageUrl: string,
) => {
  try {
    await ctx.deleteMessage();
    const message = t(key);
    const keyboard = key === 'group_schedule'
      ? Markup.inlineKeyboard(getGroupScheduleButtons())
      : Markup.inlineKeyboard(buttons[key]);

    await ctx.replyWithPhoto(
      { url: imageUrl },
      {
        caption: message,
        reply_markup: keyboard.reply_markup,
      },
    );
  } catch (error) {
    console.error(`${messageCatalog.utils_button_image_action_error_prefix} ${key}:`, error);
  }
};

// Формирование информации о группе
export const sendGroupInfo = (key: string, groups: GroupWithSchedule[]) => {
  const group = groups.find(g => g.key === key);
  if (group) {
    const message = `
${t('group_info_title_prefix')}${group.name}"

${t('group_info_phone_prefix')}${getGroupPhone(group)}

${t('group_info_address_prefix')}${group.address}
${t('group_info_description_prefix')}${group.description ? group.description : t('group_info_description_empty')}

${t('group_info_schedule_title')}
${group.schedule.map(s => `${s.days.join(', ')} — ${s.time}`).join('\n')}

${group.notes ? t('group_info_notes_prefix') + group.notes : ''}
    `;
    return message;
  } else {
    return t('group_not_found');
  }
};

function isValidUrl(s: string): boolean {
  try {
    const url = new URL(s);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Универсальный обработчик для кнопок с изображением и группой
export const handleGroupInfo = async (
  ctx: Context,
  groupKey: string,
  groups: GroupWithSchedule[],
) => {
  const group = groups.find(g => g.key === groupKey);
  if (!group) {
    return ctx.reply(t('group_not_found'));
  }

  const groupButtons = [
    [
      group.mapLink && isValidUrl(group.mapLink)
        ? Markup.button.url(t('group_map_view'), group.mapLink)
        : Markup.button.callback(
            t('group_map_unavailable'),
            'no_action',
          ),
    ],
    [
      group.videoPath && isValidUrl(group.videoPath)
        ? Markup.button.url(t('group_video_view'), group.videoPath)
        : Markup.button.callback(
            t('group_video_unavailable'),
            'no_action',
          ),
    ],
    [Markup.button.callback(t('common_back_button'), 'back')],
  ];

  try {
    await ctx.deleteMessage();
    await ctx.replyWithPhoto(
      { url: group.imageUrl },
      {
        caption: sendGroupInfo(groupKey, groups),
        reply_markup: Markup.inlineKeyboard(groupButtons).reply_markup,
      },
    );
  } catch (error) {
    console.error(`${messageCatalog.utils_group_info_error_prefix} ${groupKey}:`, error);
    // Fallback: отправляем без фото
    try {
      await ctx.reply(sendGroupInfo(groupKey, groups), {
        reply_markup: Markup.inlineKeyboard(groupButtons).reply_markup,
      });
    } catch (fallbackError) {
      console.error(messageCatalog.utils_fallback_send_error, fallbackError);
    }
  }
};
