import * as dotenv from 'dotenv';
import { Telegraf, Markup, Context } from 'telegraf';
import { handleButtonAction, handleButtonActionWithImage, handleGroupInfo } from './utils/utils';
import { urls } from './data/urls';
import { buttonKeys } from './data/buttonKeys';
import { buttons } from './data/buttons';

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

// Создаем объект для хранения истории навигации
const userNavigationStack: { [userId: string]: string[] } = {};

// Функция для добавления состояния в стек
const pushToStack = (userId: string, state: string) => {
  console.log('add state: ', state);
  if (!userNavigationStack[userId]) {
    userNavigationStack[userId] = [];
  }
  userNavigationStack[userId].push(state);
};

// Функция для извлечения последнего состояния из стека
const popFromStack = (userId: string) => {
  if (userNavigationStack[userId] && userNavigationStack[userId].length > 0) {
    return userNavigationStack[userId].pop();
  }
  return null; // Если стек пуст
};

// Приветственное сообщение
const sendWelcomeMessage = async (ctx: Context) => {
  try {
    const firstName = ctx.from?.first_name || 'человек';

    const message = `👋 Привет, ${firstName}! 

🤖 Я бот содружества "Анонимные Алкоголики". Теперь твоя очередь представиться, кто ты?

Нажми на кнопку ниже 👇👇👇`;

    const keyboard = Markup.inlineKeyboard(buttons.welcome);

    await ctx.replyWithPhoto(
      { url: urls.welcome },
      {
        caption: message,
        reply_markup: keyboard.reply_markup
      }
    );

    // await forwardMessageToAdmin(ctx, 'welcome');
  } catch (error) {
    console.error('Ошибка при отправке приветственного сообщения:', error);
  }
};

// Регистрация обработчиков для кнопок Приветствие
buttonKeys.welcome.forEach(key => {
  bot.action(key, async ctx => {
    try {
      const userId: number | string = ctx.from?.id || 'Не указано';
      pushToStack(userId.toString(), 'welcome');

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
    console.log('key: ', key);
    const userId: number | string = ctx.from?.id || 'Не указано';
    pushToStack(userId.toString(), 'newbie');

    if (key === 'group_schedule') {
      console.log("1111111111111111")
      try {
        await handleButtonActionWithImage(ctx, 'group_schedule', urls.group_schedule);
      } catch (error) {
        console.error(
          `Ошибка при регистрации обработчика для кнопки 'group_schedule':`,
          error,
        );
      }
    } else {
      console.log("2222222222222222222")
      try {
        await handleButtonAction(ctx, key);
      } catch (error) {
        console.error(
          `Ошибка при регистрации обработчика для кнопки ${key}:`,
          error,
        );
      }
    }
  });
});

// Регистрация обработчиков для кнопок Расписание групп
// bot.action('group_schedule', async ctx => {
//   try {
//     // const userId: number | string = ctx.from?.id || 'Не указано';
//     // pushToStack(userId.toString(), 'group_schedule');

//     await handleButtonActionWithImage(ctx, 'group_schedule', urls.group_schedule);
//   } catch (error) {
//     console.error(
//       `Ошибка при регистрации обработчика для кнопки 'group_schedule':`,
//       error,
//     );
//   }
// });

// Регистрация обработчиков для кнопок Вопрос - ответ
buttonKeys.faq.forEach(key => {
  bot.action(key, async ctx => {
    try {
      // const userId: number | string = ctx.from?.id || 'Не указано';
      // pushToStack(userId.toString(), 'faq');

      await handleButtonAction(ctx, key);
    } catch (error) {
      console.error(
        `Ошибка при регистрации обработчика для кнопки ${key}:`,
        error,
      );
    }
  });
});

// Регистрация обработчиков для кнопок Группа ...
buttonKeys.group_schedule.forEach(key => {
  bot.action(key, async ctx => {
    try {
      // const userId: number | string = ctx.from?.id || 'Не указано';
      // pushToStack(userId.toString(), 'group_schedule');

      await handleGroupInfo(ctx, key);
    } catch (error) {
      console.error(
        `Ошибка при регистрации обработчика для кнопки ${key}:`,
        error,
      );
    }
  });
});

// Регистрация обработчиков для кнопок Член АА
buttonKeys.participant.forEach(key => {
  bot.action(key, async ctx => {
    const userId: number | string = ctx.from?.id || 'Не указано';
    pushToStack(userId.toString(), 'participant');

    if (key === 'group_schedule') {
      console.log("333333333")
      try {
        await handleButtonActionWithImage(ctx, 'group_schedule', urls.group_schedule);
      } catch (error) {
        console.error(
          `Ошибка при регистрации обработчика для кнопки 'group_schedule':`,
          error,
        );
      }
    } else {
      console.log("4444444444444")
      try {
        await handleButtonAction(ctx, key);
      } catch (error) {
        console.error(
          `Ошибка при регистрации обработчика для кнопки ${key}:`,
          error,
        );
      }
    }
  });
});

// Регистрация обработчиков для кнопок Родственник
buttonKeys.relative.forEach(key => {
  bot.action(key, async ctx => {
    try {
      // const userId: number | string = ctx.from?.id || 'Не указано';
      // pushToStack(userId.toString(), 'relative');

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
bot.action('back', async ctx => {
  try {
    const previousState = popFromStack(ctx.from.id.toString()); // Извлекаем предыдущее состояние
    if (previousState) {
      console.log('previousState: ', previousState);
      // В зависимости от предыдущего состояния, отправляем соответствующее сообщение
      if (previousState === 'welcome') {
        await ctx.deleteMessage();
        await sendWelcomeMessage(ctx);
      } else if (previousState === 'newbie') {
        await handleButtonAction(ctx, 'newbie');
      }
    }
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
