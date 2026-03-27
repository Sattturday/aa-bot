import { Context, Markup, Telegraf } from 'telegraf';
import { addToHistory } from './history';
import { buttons } from '../data/buttons';
import { Update } from 'telegraf/typings/core/types/typegram';
import { buttonKeys } from '../data/buttonKeys';
import { pushToStack, popFromStack, clearUserNavigationStack } from './navigationStack';
import {
  handleButtonAction,
  handleButtonActionWithImage,
  handleGroupInfo,
  sendWelcomeMessage,
} from './utils';
import {
  getAaGroups,
  getGroupScheduleKeys,
  getUrlValue,
  getMessageText,
} from '../db/dataProvider';
import { isAdmin } from '../db/adminsRepo';

function getUserInfo(ctx: Context) {
  const userId = (ctx.from?.id || 0).toString();
  const firstName = ctx.from?.first_name || '';
  const lastName = ctx.from?.last_name || '';
  const username = ctx.from?.username || '';
  return { userId, firstName, lastName, username };
}

function track(ctx: Context, action: string) {
  const { userId, firstName, lastName, username } = getUserInfo(ctx);
  addToHistory(userId, action, firstName, lastName, username);
}

export const registerButtonHandlers = (bot: Telegraf<Context<Update>>) => {
  // no_action — заглушка для недоступных кнопок
  bot.action('no_action', async ctx => {
    await ctx.answerCbQuery('Пока недоступно');
  });

  // Регистрация обработчика для /start
  bot.start(async ctx => {
    const firstName = ctx.from?.first_name || 'друг';
    const message = `👋 Привет, ${firstName}!`;
    const keyboard = Markup.inlineKeyboard(buttons.start).reply_markup;

    track(ctx, '/start');

    await ctx.replyWithPhoto(
      { url: getUrlValue('welcome') },
      {
        caption: message + getMessageText('start'),
        reply_markup: keyboard,
      },
    );
  });

  // Регистрация обработчиков для кнопок /start
  buttonKeys.start.forEach(key => {
    bot.action(key, async ctx => {
      try {
        await ctx.answerCbQuery();
        const { userId } = getUserInfo(ctx);
        pushToStack(userId, 'start');
        track(ctx, key);

        await ctx.deleteMessage();
        await sendWelcomeMessage(ctx);
      } catch (error) {
        console.error(
          `Ошибка при регистрации обработчика для кнопки ${key}:`,
          error,
        );
      }
    });
  });

  // Регистрация обработчиков для кнопок Приветствие
  buttonKeys.welcome.forEach(key => {
    bot.action(key, async ctx => {
      try {
        await ctx.answerCbQuery();
        const { userId } = getUserInfo(ctx);
        pushToStack(userId, 'welcome');
        track(ctx, key);

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
      await ctx.answerCbQuery();
      const { userId } = getUserInfo(ctx);
      pushToStack(userId, 'newbie');
      track(ctx, key);

      try {
        if (key === 'newbie_group_schedule') {
          await handleButtonActionWithImage(
            ctx,
            'group_schedule',
            getUrlValue('group_schedule'),
          );
        } else if (key === 'newbie_about_aa' || key === 'newbie_literature') {
          await handleButtonAction(ctx, key.slice(7));
        } else {
          await handleButtonAction(ctx, key);
        }
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
      await ctx.answerCbQuery();
      const { userId } = getUserInfo(ctx);
      pushToStack(userId, 'participant');
      track(ctx, key);

      try {
        if (key === 'participant_group_schedule') {
          await handleButtonActionWithImage(
            ctx,
            'group_schedule',
            getUrlValue('group_schedule'),
          );
        } else if (key === 'participant_literature') {
          await handleButtonAction(ctx, key.slice(12));
        } else {
          await handleButtonAction(ctx, key);
        }
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
        await ctx.answerCbQuery();
        const { userId } = getUserInfo(ctx);
        pushToStack(userId, 'faq');
        track(ctx, key);

        await handleButtonAction(ctx, key);
      } catch (error) {
        console.error(
          `Ошибка при регистрации обработчика для кнопки ${key}:`,
          error,
        );
      }
    });
  });

  // Регистрация обработчиков для кнопок О программе АА
  buttonKeys.about_aa.forEach(key => {
    bot.action(key, async ctx => {
      try {
        await ctx.answerCbQuery();
        const { userId } = getUserInfo(ctx);
        pushToStack(userId, 'about_aa');
        track(ctx, key);

        await handleButtonAction(ctx, key);
      } catch (error) {
        console.error(
          `Ошибка при регистрации обработчика для кнопки ${key}:`,
          error,
        );
      }
    });
  });

  // Регистрация обработчиков для кнопок Группа (динамически из БД)
  const registerGroupHandlers = () => {
    const groupKeys = getGroupScheduleKeys();
    groupKeys.forEach(key => {
      bot.action(key, async ctx => {
        try {
          await ctx.answerCbQuery();
          const { userId } = getUserInfo(ctx);
          pushToStack(userId, 'group_schedule');
          track(ctx, key);

          await handleGroupInfo(ctx, key, getAaGroups());
        } catch (error) {
          console.error(
            `Ошибка при регистрации обработчика для кнопки ${key}:`,
            error,
          );
        }
      });
    });
  };

  registerGroupHandlers();

  // Catch-all for dynamic group keys that weren't registered at startup
  // (groups added via admin panel after bot starts)
  bot.action(/^group_/, async ctx => {
    try {
      await ctx.answerCbQuery();
      const key = ctx.match[0];
      const { userId } = getUserInfo(ctx);
      pushToStack(userId, 'group_schedule');
      track(ctx, key);

      await handleGroupInfo(ctx, key, getAaGroups());
    } catch (error) {
      console.error('Ошибка при обработке динамической группы:', error);
    }
  });

  // Регистрация обработчиков для кнопок Родственник
  buttonKeys.relative.forEach(key => {
    bot.action(key, async ctx => {
      try {
        await ctx.answerCbQuery();
        const { userId } = getUserInfo(ctx);
        pushToStack(userId, 'relative');
        track(ctx, key);

        if (key === 'relative_about_aa') {
          await handleButtonAction(ctx, key.slice(9));
        } else {
          await handleButtonAction(ctx, key);
        }
      } catch (error) {
        console.error(
          `Ошибка при регистрации обработчика для кнопки ${key}:`,
          error,
        );
      }
    });
  });

  // Обработка нажатий на кнопку "Назад"
  bot.action('back', async ctx => {
    try {
      await ctx.answerCbQuery();
      const previousState = popFromStack((ctx.from?.id || 0).toString());
      track(ctx, 'back');

      if (previousState) {
        if (previousState === 'welcome') {
          await ctx.deleteMessage();
          clearUserNavigationStack((ctx.from?.id || 0).toString());
          await sendWelcomeMessage(ctx);
        } else {
          await handleButtonAction(ctx, previousState);
        }
      } else {
        await ctx.deleteMessage();
        await sendWelcomeMessage(ctx);
      }
    } catch (error) {
      console.error('Ошибка при обработке кнопки "Назад":', error);
    }
  });

  // Кнопка админ-панели
  bot.action('admin_panel', async ctx => {
    try {
      const { userId } = getUserInfo(ctx);
      if (!isAdmin(userId)) {
        await ctx.answerCbQuery('У вас нет доступа к админ-панели.');
        return;
      }
      track(ctx, 'admin_panel');
      const webAppUrl = process.env.WEBAPP_URL;
      if (webAppUrl) {
        await ctx.reply('Откройте админ-панель:', Markup.inlineKeyboard([
          [Markup.button.webApp('🔧 Админ-панель', webAppUrl)],
        ]));
      } else {
        await ctx.reply('Админ-панель не настроена. Укажите WEBAPP_URL.');
      }
    } catch (error) {
      console.error('Ошибка при открытии админ-панели:', error);
    }
  });

  // Обработка текстовых сообщений
  bot.on('text', async ctx => {
    track(ctx, 'text: ' + ctx.message.text);

    try {
      await sendWelcomeMessage(ctx);
    } catch (error) {
      console.error('Ошибка при обработке текстового сообщения:', error);
    }
  });

  // Обработка всех других сообщений
  bot.on('message', async ctx => {
    track(ctx, 'unknown_message');

    try {
      await ctx.reply(
        `🤔 Я пока не могу обработать это сообщение.

Но я могу помочь вам вернуться в главное меню или связаться с участником АА (алкоголиком, который не пьет).

Выберите, пожалуйста, подходящий вариант:`,
        Markup.inlineKeyboard([
          [Markup.button.callback('🏠 Главное меню', 'back')],
          [Markup.button.url('💬 Связаться с участником АА', getUrlValue('question'))],
        ]),
      );
    } catch (error) {
      console.error('Ошибка при обработке неизвестного сообщения:', error);
    }
  });
};
