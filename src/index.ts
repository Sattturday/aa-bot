import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { registerButtonHandlers } from './utils/handlers';
import { sendStatisticsToAdmin } from './utils/history';

dotenv.config();

const token = process.env.BOT_TOKEN;
const tgId = process.env.TG_ID;

if (!token || !tgId) {
  console.error('Ошибка: переменные окружения не определены.');
  process.exit(1);
}

const bot = new Telegraf(token);

// Создаем объект для хранения истории навигации
let userNavigationStack: { [userId: string]: string[] } = {};

export const clearUserNavigationStack = (id: string) => {
  userNavigationStack[id].length = 0;
};

// Функция для добавления состояния в стек
export const pushToStack = (userId: string, state: string) => {
  if (!userNavigationStack[userId]) {
    userNavigationStack[userId] = [];
  }
  userNavigationStack[userId].push(state);
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

// Отправляем статистику каждые 24 часа
// setInterval(sendStatisticsToAdmin, 24 * 60 * 60 * 1000);
setInterval(() => sendStatisticsToAdmin(bot, tgId), 3 * 60 * 60 * 1000);

// Функция для запуска бота с перезапуском в случае ошибки.
async function startBot() {
  try {
    console.log('Запуск бота...');

    // Отправляем сообщение о запуске
    if (tgId) {
      await bot.telegram.sendMessage(tgId, 'Ура, бот запущен!');
    }

    // Запускаем бота
    await bot.launch();
  } catch (error) {
    console.error('Ошибка при запуске бота:', error);
    console.log('Попытка перезапуска бота через 1 минуту...');

    // Перезапуск бота через 60 секунд
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
