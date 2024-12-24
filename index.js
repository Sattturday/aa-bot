const { Telegraf, Markup } = require('telegraf');
const { messages, buttonKeys, buttons } = require('./messages');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const tgId = process.env.TG_ID;
const bot = new Telegraf(token);

// Функция для пересылки сообщений на ваш аккаунт
const forwardMessageToAdmin = async (ctx, action) => {
  try {
    const userName = ctx.from.first_name || 'Не указано'; // Имя пользователя
    const userId = ctx.from.id || 'Не указано'; // ID пользователя
    const userUsername = ctx.from.username ? `@${ctx.from.username}` : 'Не указано'; // Username пользователя
    const message = `Пользователь: ${userName}\nUsername: ${userUsername}\nID: ${userId}\nДействие: ${action}`;
    await bot.telegram.sendMessage(tgId, message);
  } catch (error) {
    console.error('Ошибка при пересылке сообщения администратору:', error);
  }
};

// Приветственное сообщение
const sendWelcomeMessage = async (ctx) => {
  const firstName = ctx.from.first_name; // Получаем имя пользователя
  ctx.reply(messages.welcome(firstName), Markup.inlineKeyboard(buttons.welcome));
  await forwardMessageToAdmin(ctx, 'welcome'); // Пересылаем сообщение администратору
};

// Универсальный обработчик для кнопок
const handleButtonAction = async (ctx, key) => {
  await ctx.deleteMessage();
  await ctx.reply(messages[key], Markup.inlineKeyboard(buttons[key]));
  await forwardMessageToAdmin(ctx, key); // Пересылаем сообщение администратору
};

// Регистрация обработчиков для кнопок Приветствие
buttonKeys.welcome.forEach(key => {
  bot.action(key, (ctx) => handleButtonAction(ctx, key));
});

// Регистрация обработчиков для кнопок Новичок
buttonKeys.newbie.forEach(key => {
  bot.action(key, (ctx) => handleButtonAction(ctx, key));
});

// Обработка нажатий на кнопку "Назад" для возврата к приветствию
bot.action('back_to_start', async (ctx) => {
  await ctx.deleteMessage();
  sendWelcomeMessage(ctx);
});

// Обработка других сообщений (если пользователь напишет что-то другое)
bot.on('text', ctx => {
  sendWelcomeMessage(ctx);
});

bot.launch();
console.log('Ура, бот запущен!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
