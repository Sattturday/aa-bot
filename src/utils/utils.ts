import { Context, Markup } from "telegraf";
import { messages } from "../data/messages";
import { Groups, groups } from "../data/groups";
import { buttons } from "../data/buttons";

// Универсальный обработчик для кнопок
export const handleButtonAction = async (ctx: Context, key: string) => {
  console.log('key: ', key);
  try {
    await ctx.deleteMessage();

    await ctx.reply(messages[key], Markup.inlineKeyboard(buttons[key]));
    // await forwardMessageToAdmin(ctx, key);
  } catch (error) {
    console.error(`Ошибка при обработке действия кнопки ${key}:`, error);
  }
};

// Универсальный обработчик для кнопок с изображением
export const handleButtonActionWithImage = async (ctx: Context, key: string, imageUrl: string) => {
  try {
    await ctx.deleteMessage();
    const message = messages[key]; // Получаем текст сообщения по ключу
    const keyboard = Markup.inlineKeyboard(buttons[key]); // Получаем кнопки по ключу

    // Отправка изображения вместе с сообщением
    await ctx.replyWithPhoto(
      { url: imageUrl }, // URL изображения
      {
        caption: message,
        reply_markup: keyboard.reply_markup // Используем созданную клавиатуру
      }
    );

    // await forwardMessageToAdmin(ctx, key);
  } catch (error) {
    console.error(`Ошибка при обработке действия кнопки с изображением ${key}:`, error);
  }
};

// Формирование информации о группе
export const sendGroupInfo = (key: string) => {
  const group = groups.find(g => g.key === key);
  if (group) {
    const message = `
👥 Группа "${group.name}"

📞 ${group.phone}

📍 ${group.address}
👀 ${group.description}

🗓️ Расписание:
${group.schedule.map(s => `${s.days.join(", ")} — ${s.time}`).join("\n")}

🗣 ${group.notes ? group.notes : ''}
    `;
    return message;
  } else {
    return "Группа не найдена.";
  }
};

// Универсальный обработчик для кнопок с изображением и группой
export const handleGroupInfo = async (ctx: Context, groupKey: string) => {
  const group = groups.find(g => g.key === groupKey);
  if (!group) {
    return ctx.reply("Группа не найдена.");
  }

  const buttons = [];

  // Проверяем наличие ссылки на карту
  if (group.mapLink) {
    buttons.push([Markup.button.url('🗺 Посмотреть на карте', group.mapLink)]);
  } else {
    buttons.push([Markup.button.callback('🗺 Посмотреть на карте (недоступно)', 'no_action')]);
  }

  // Проверяем наличие ссылки на видео
  if (group.videoPath) {
    buttons.push([Markup.button.url('📹 Посмотреть видео пути', group.videoPath)]);
  } else {
    buttons.push([Markup.button.callback('📹 Посмотреть видео пути (недоступно)', 'no_action')]);
  }

  buttons.push([Markup.button.callback('⬅️ Назад', 'group_schedule')]);

  try {
    await ctx.deleteMessage();
    await ctx.replyWithPhoto(
      { url: group.imageUrl }, // URL изображения
      {
        caption: sendGroupInfo(groupKey),
        reply_markup: Markup.inlineKeyboard(buttons).reply_markup
      }
    );
  } catch (error) {
    console.error(`Ошибка при обработке информации о группе ${groupKey}:`, error);
  }
};

// Функция для формирования сообщения с расписанием всех групп
export function generateGroupScheduleMessage(groups: Groups): string {
  const header = `🙏 Остаться трезвым непросто, но Вы не одни. Группы АА поддержат Вас на пути к выздоровлению.\n\n📞 Горячая линия +7 (905) 346-65-67\n\n`;

  const groupMessages = groups.map((group, index) => {
    const scheduleText = group.schedule.map(s => `${s.days.join(", ")} в ${s.time}`).join("; ");
    return `${index + 1}️⃣ Группа "${group.name}"\n📍${group.address}\n🕖 ${scheduleText}\n📞${group.phone}\n`;
  }).join("\n");

  return header + groupMessages;
};
