import * as dotenv from 'dotenv';
import { Telegraf, Markup, Context } from 'telegraf';
import { urls, buttonKeys, buttons, messages } from './messages';

dotenv.config();

const token = process.env.BOT_TOKEN;
const tgId = process.env.TG_ID;

if (!token) {
  console.error('Ошибка: переменная окружения BOT_TOKEN не определена.');
  process.exit(1); // Завершение программы с кодом 1
}

if (!tgId) {
  console.error('Ошибка: переменная окружения TG_ID не определена.');
  process.exit(1); // Завершение программы с кодом 1
}

const bot = new Telegraf(token);

// Функция для пересылки сообщений на ваш аккаунт
const forwardMessageToAdmin = async (ctx: Context, action: string) => {
  try {
    const userName = ctx.from?.first_name || 'Не указано';
    const userId = ctx.from?.id || 'Не указано';
    const userUsername = ctx.from?.username
      ? `@${ctx.from.username}`
      : 'Не указано';
    const message = `Пользователь: ${userName}\nUsername: ${userUsername}\nID: ${userId}\nДействие: ${action}`;
    await bot.telegram.sendMessage(tgId, message);
  } catch (error) {
    console.error('Ошибка при пересылке сообщения администратору:', error);
  }
};

// Приветственное сообщение
const sendWelcomeMessage = async (ctx: Context) => {
  try {
    const firstName = ctx.from?.first_name || 'человек';

    const message = `👋 Привет, ${firstName}! 

🤖 Я бот содружества "Анонимные Алкоголики". Теперь твоя очередь представиться, кто ты?

Нажми на кнопку ниже 👇👇👇`;

    // Создание клавиатуры
    const keyboard = Markup.inlineKeyboard(buttons.welcome);

    // Отправка изображения вместе с приветственным сообщением
    await ctx.replyWithPhoto(
      { url: urls.welcome }, // Замените на URL вашего изображения
      {
        caption: message,
        reply_markup: keyboard.reply_markup // Используем созданную клавиатуру
      }
    );

    // await forwardMessageToAdmin(ctx, 'welcome');
  } catch (error) {
    console.error('Ошибка при отправке приветственного сообщения:', error);
  }
};

// Универсальный обработчик для кнопок
const handleButtonAction = async (ctx: Context, key: string) => {
  try {
    await ctx.deleteMessage();
    await ctx.reply(messages[key], Markup.inlineKeyboard(buttons[key]));
    // await forwardMessageToAdmin(ctx, key);
  } catch (error) {
    console.error(`Ошибка при обработке действия кнопки ${key}:`, error);
  }
};

// Регистрация обработчиков для кнопок Приветствие
buttonKeys.welcome.forEach(key => {
  bot.action(key, async ctx => {
    try {
      await handleButtonAction(ctx, key);
    } catch (error) {
      console.error(
        `Ошибка при регистрации обработчика для кнопки ${key}:`,
        error,
      );
    }
  });
});

// Регистрация обработчиков для кнопок Новичок
buttonKeys.newbie.forEach(key => {
  bot.action(key, async ctx => {
    try {
      await handleButtonAction(ctx, key);
    } catch (error) {
      console.error(
        `Ошибка при регистрации обработчика для кнопки ${key}:`,
        error,
      );
    }
  });
});

// Регистрация обработчиков для кнопок Вопрос - ответ
buttonKeys.faq.forEach(key => {
  bot.action(key, async ctx => {
    try {
      await handleButtonAction(ctx, key);
    } catch (error) {
      console.error(
        `Ошибка при регистрации обработчика для кнопки ${key}:`,
        error,
      );
    }
  });
});

// Обработка нажатий на кнопку "Назад" для возврата к приветствию
bot.action('back_to_start', async ctx => {
  try {
    await ctx.deleteMessage();
    await sendWelcomeMessage(ctx);
  } catch (error) {
    console.error('Ошибка при обработке кнопки "Назад":', error);
  }
});

// Обработка других сообщений (если пользователь напишет что-то другое)
bot.on('text', async ctx => {
  try {
    await sendWelcomeMessage(ctx);
  } catch (error) {
    console.error('Ошибка при обработке текстового сообщения:', error);
  }
});

// Запуск бота
bot.launch().catch(error => {
  console.error('Ошибка при запуске бота:', error);
});
console.log('Ура, бот запущен!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
