import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { initDatabase } from './db/database';
import { seedDatabase } from './db/seed';
import { addAdmin } from './db/adminsRepo';
import { registerButtonHandlers } from './utils/handlers';
import { sendStatisticsToAdmin } from './utils/history';
import { createServer } from './server';

dotenv.config();

const token = process.env.BOT_TOKEN;
const tgId = process.env.TG_ID;
const port = parseInt(process.env.PORT || '3000', 10);
const adminIds = process.env.ADMIN_IDS || '';

if (!token || !tgId) {
  console.error('Ошибка: переменные окружения не определены.');
  process.exit(1);
}

// Initialize database and seed data
initDatabase();
seedDatabase();

// Seed initial admins from env
if (adminIds) {
  for (const id of adminIds.split(',').map(s => s.trim()).filter(Boolean)) {
    addAdmin(id);
  }
}
// Always add TG_ID as admin
addAdmin(tgId);

const bot = new Telegraf(token);

// Навигационный стек с ограничением по размеру (макс 10000 пользователей)
const MAX_NAV_USERS = 10000;
let userNavigationStack: { [userId: string]: string[] } = {};

function trimNavigationStack() {
  const keys = Object.keys(userNavigationStack);
  if (keys.length > MAX_NAV_USERS) {
    // Удаляем первую половину (самые старые)
    const toRemove = keys.slice(0, keys.length - MAX_NAV_USERS);
    for (const k of toRemove) {
      delete userNavigationStack[k];
    }
  }
}

export const clearUserNavigationStack = (id: string) => {
  delete userNavigationStack[id];
};

// Функция для добавления состояния в стек
export const pushToStack = (userId: string, state: string) => {
  if (!userNavigationStack[userId]) {
    userNavigationStack[userId] = [];
  }
  userNavigationStack[userId].push(state);
  trimNavigationStack();
};

// Функция для извлечения последнего состояния из стека
export const popFromStack = (userId: string) => {
  if (userNavigationStack[userId] && userNavigationStack[userId].length > 0) {
    return userNavigationStack[userId].pop();
  }
  return null;
};

// Регистрация обработчиков кнопок
registerButtonHandlers(bot);

// Отправляем статистику каждые 3 часа
setInterval(() => sendStatisticsToAdmin(bot, tgId), 3 * 60 * 60 * 1000);

// Start Express server for API and admin panel
const app = createServer(bot);
app.listen(port, () => {
  console.log(`Express сервер запущен на порту ${port}`);
});

// Функция для запуска бота с перезапуском в случае ошибки
async function startBot() {
  try {
    console.log('Запуск бота...');

    if (tgId) {
      await bot.telegram.sendMessage(tgId, 'Ура, бот запущен!');
    }

    await bot.launch();
  } catch (error) {
    console.error('Ошибка при запуске бота:', error);
    console.log('Попытка перезапуска бота через 1 минуту...');
    setTimeout(startBot, 60 * 1000);
  }
}

// Обработка сигналов завершения процесса
process.on('SIGINT', async () => {
  console.log('Получен сигнал SIGINT. Остановка бота...');
  await bot.stop();
  process.exit();
});

process.on('SIGTERM', async () => {
  console.log('Получен сигнал SIGTERM. Остановка бота...');
  await bot.stop();
  process.exit();
});

// Запускаем бота
startBot();
