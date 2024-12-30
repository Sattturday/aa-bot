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
  console.log('userNavigationStack: ', userNavigationStack);
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
setInterval(() => sendStatisticsToAdmin(bot, tgId), 60 * 1000);

// Запуск бота
bot.launch().catch(error => {
  console.error('Ошибка при запуске бота:', error);
});
console.log('Ура, бот запущен!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
