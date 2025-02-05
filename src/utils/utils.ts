import { Context, Markup } from 'telegraf';
import { messages } from '../data/messages';
import { Groups } from '../data/groups';
import { buttons } from '../data/buttons';

// Главное меню
export const sendWelcomeMessage = async (ctx: Context) => {
  try {
    const message = 'Выбери подходящий вариант и нажми на кнопку ниже 👇';

    await ctx.reply(message, Markup.inlineKeyboard(buttons.welcome));
  } catch (error) {
    console.error('Ошибка при отправке приветственного сообщения:', error);
  }
};

// Универсальный обработчик для кнопок
export const handleButtonAction = async (ctx: Context, key: string) => {
  try {
    await ctx.deleteMessage();

    await ctx.reply(messages[key], Markup.inlineKeyboard(buttons[key]));
    // await forwardMessageToAdmin(ctx, key);
  } catch (error) {
    console.error(`Ошибка при обработке действия кнопки ${key}:`, error);
  }
};

// Универсальный обработчик для кнопок с изображением
export const handleButtonActionWithImage = async (
  ctx: Context,
  key: string,
  imageUrl: string,
) => {
  try {
    await ctx.deleteMessage();
    const message = messages[key]; // Получаем текст сообщения по ключу
    const keyboard = Markup.inlineKeyboard(buttons[key]); // Получаем кнопки по ключу

    // Отправка изображения вместе с сообщением
    await ctx.replyWithPhoto(
      { url: imageUrl }, // URL изображения
      {
        caption: message,
        reply_markup: keyboard.reply_markup, // Используем созданную клавиатуру
      },
    );

    // await forwardMessageToAdmin(ctx, key);
  } catch (error) {
    console.error(
      `Ошибка при обработке действия кнопки с изображением ${key}:`,
      error,
    );
  }
};

// Формирование информации о группе
export const sendGroupInfo = (key: string, groups: Groups) => {
  const group = groups.find(g => g.key === key);
  if (group) {
    const message = `
👥 Группа "${group.name}"

📞 ${group.phone}

📍 ${group.address}
👀 ${group.description ? group.description : '(нет подробностей)'}

🗓️ Расписание:
${group.schedule.map(s => `${s.days.join(', ')} — ${s.time}`).join('\n')}

${group.notes ? '🗣 ' + group.notes : ''}
    `;
    return message;
  } else {
    return 'Группа не найдена.';
  }
};

// Универсальный обработчик для кнопок с изображением и группой
export const handleGroupInfo = async (
  ctx: Context,
  groupKey: string,
  groups: Groups,
) => {
  const group = groups.find(g => g.key === groupKey);
  if (!group) {
    return ctx.reply('Группа не найдена.');
  }

  const buttons = [
    [
      group.mapLink
        ? Markup.button.url('🗺 Посмотреть на карте', group.mapLink)
        : Markup.button.callback(
            '🗺 Посмотреть на карте (недоступно)',
            'no_action',
          ),
    ],
    [
      group.videoPath
        ? Markup.button.url('📹 Посмотреть видео пути', group.videoPath)
        : Markup.button.callback(
            '📹 Посмотреть видео пути (недоступно)',
            'no_action',
          ),
    ],
    [Markup.button.callback('⬅️ Назад', 'back')],
  ];

  try {
    await ctx.deleteMessage();
    await ctx.replyWithPhoto(
      { url: group.imageUrl }, // URL изображения
      {
        caption: sendGroupInfo(groupKey, groups),
        reply_markup: Markup.inlineKeyboard(buttons).reply_markup,
      },
    );
  } catch (error) {
    console.error(
      `Ошибка при обработке информации о группе ${groupKey}:`,
      error,
    );
  }
};

// Функция для формирования сообщения с расписанием всех групп
export function generateGroupScheduleMessage(
  header: string,
  groups: Groups,
): string {
  const groupMessages = groups
    .map((group, index) => {
      const scheduleText = group.schedule
        .map(s => `${s.days.join(', ')} в ${s.time}`)
        .join('; ');
      return `${index + 1}️⃣ Группа "${group.name}"\n📍${group.address}\n🚩${
        group.description ? group.description : '---'
      }\n🕖 ${scheduleText}\n📞${group.phone}\n`;
    })
    .join('\n');

  return header + groupMessages;
}
