// src/utils/history.ts
import * as fs from 'fs';
import * as path from 'path';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

export interface UserAction {
  time: string;
  action: string;
}

export let userNavigationHistory: { [userId: string]: UserAction[] } = {};

// Функция для добавления состояния в историю
export const addToHistory = (userId: string, action: string) => {
  const timestamp = new Date().toISOString();
  if (!userNavigationHistory[userId]) {
    userNavigationHistory[userId] = [];
  }
  userNavigationHistory[userId].push({ time: timestamp, action });
  console.log('userNavigationHistory: ', userNavigationHistory);
};

// Функция для записи истории в файл
const writeHistoryToFile = async (bot: Telegraf<Context<Update>>) => {
  const filePath = path.join(__dirname, 'user_history.txt');
  let fileContent = '📊 Статистика взаимодействия:\n\n';

  for (const userId in userNavigationHistory) {
    try {
      const userActions = userNavigationHistory[userId];
      const chat = await bot.telegram.getChat(userId);

      if (chat && chat.type === 'private') {
        const userName = chat.first_name || 'Не указано';
        const userUsername = chat.username ? `@${chat.username}` : 'Не указано';

        fileContent += `👤 Пользователь: ${userName}\n`;
        fileContent += `Username: ${userUsername}\n`;
        fileContent += `ID: ${userId}\n`;
        fileContent += `История взаимодействия:\n`;

        userActions.forEach(({ time, action }) => {
          fileContent += `🕒 ${time} - ${action}\n`;
        });

        fileContent += '\n';
      }
    } catch (error) {
      console.error(`Ошибка при обработке userId ${userId}:`, error);
    }
  }

  // Записываем содержимое в файл
  fs.writeFileSync(filePath, fileContent);
  return filePath;
};

export const sendStatisticsToAdmin = async (
  bot: Telegraf<Context<Update>>,
  tgId: string,
) => {
  try {
    // Check if the history is empty
    if (Object.keys(userNavigationHistory).length === 0) {
      await bot.telegram.sendMessage(tgId, 'Никто не приходил.');
      console.log(
        'История пуста, отправлено сообщение о том, что никто не приходил.',
      );
    } else {
      const filePath = await writeHistoryToFile(bot);
      await bot.telegram.sendDocument(tgId, { source: filePath });
      // Очистка истории после успешной отправки
      userNavigationHistory = {};
      console.log('История взаимодействий очищена.');
    }
  } catch (error) {
    console.error('Ошибка при отправке статистики администратору:', error);
  }
};
