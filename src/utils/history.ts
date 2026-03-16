// src/utils/history.ts
import * as fs from 'fs';
import * as path from 'path';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import * as usersRepo from '../db/usersRepo';

// Track user action — saves to DB
export const addToHistory = (
  userId: string,
  action: string,
  firstName = '',
  lastName = '',
  username = '',
) => {
  try {
    usersRepo.trackUser(userId, firstName, lastName, username, action);
  } catch (error) {
    console.error('Ошибка при записи в историю:', error);
  }
  console.log(`[history] ${userId}: ${action}`);
};

// Write recent history to file (for sending to admin)
const writeHistoryToFile = async (bot: Telegraf<Context<Update>>) => {
  const filePath = path.join(__dirname, 'user_history.txt');

  const recentData = usersRepo.getRecentActions(3);

  if (recentData.length === 0) {
    return null;
  }

  let fileContent = '📊 Статистика взаимодействия:\n\n';

  for (const { user, actions } of recentData) {
    fileContent += `👤 Пользователь: ${user.first_name || 'Не указано'}\n`;
    fileContent += `Username: ${user.username ? '@' + user.username : 'Не указано'}\n`;
    fileContent += `ID: ${user.telegram_id}\n`;
    fileContent += `История взаимодействия:\n`;

    actions.forEach(({ created_at, action }) => {
      fileContent += `🕒 ${created_at} - ${action}\n`;
    });

    fileContent += '\n';
  }

  fs.writeFileSync(filePath, fileContent);
  return filePath;
};

export const sendStatisticsToAdmin = async (
  bot: Telegraf<Context<Update>>,
  tgId: string,
) => {
  try {
    const stats = usersRepo.getStats(3);

    if (stats.totalActions === 0) {
      await bot.telegram.sendMessage(tgId, 'Никто не приходил.');
      console.log('История пуста за последние 3 часа.');
    } else {
      const filePath = await writeHistoryToFile(bot);
      if (filePath) {
        await bot.telegram.sendDocument(tgId, { source: filePath });
      }
      console.log(`Статистика отправлена: ${stats.activeUsers} пользователей, ${stats.totalActions} действий.`);
    }
  } catch (error) {
    console.error('Ошибка при отправке статистики администратору:', error);
  }
};
