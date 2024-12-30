import { Context, Markup, Telegraf } from 'telegraf';
import { addToHistory } from './history';
import { buttons } from '../data/buttons';
import { Update } from 'telegraf/typings/core/types/typegram';
import { urls } from '../data/urls';
import { buttonKeys } from '../data/buttonKeys';
import { pushToStack, popFromStack, clearUserNavigationStack } from '..';
import {
  handleButtonAction,
  handleButtonActionWithImage,
  handleGroupInfo,
  sendWelcomeMessage,
} from './utils';
import { messages } from '../data/messages';

export const registerButtonHandlers = (bot: Telegraf<Context<Update>>) => {
  // Регистрация обработчика для /start
  bot.start(async ctx => {
    const firstName = ctx.from?.first_name || 'друг';
    const message = `👋 Привет, ${firstName}!`;
    const keyboard = Markup.inlineKeyboard(buttons.start).reply_markup;

    await ctx.replyWithPhoto(
      { url: urls.welcome },
      {
        caption: message + messages.start,
        reply_markup: keyboard,
      },
    );
  });

  // Регистрация обработчиков для кнопок /start
  buttonKeys.start.forEach(key => {
    bot.action(key, async ctx => {
      try {
        const userId: number | string = ctx.from?.id || 'Не указано';
        pushToStack(userId.toString(), 'start');
        addToHistory(userId.toString(), key);

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
        const userId: number | string = ctx.from?.id || 'Не указано';
        pushToStack(userId.toString(), 'welcome');
        addToHistory(userId.toString(), key);

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
      const userId: number | string = ctx.from?.id || 'Не указано';
      pushToStack(userId.toString(), 'newbie');
      addToHistory(userId.toString(), key);

      try {
        if (key === 'newbie_group_schedule') {
          console.log('Открытие расписания для новичка');
          await handleButtonActionWithImage(
            ctx,
            'group_schedule',
            urls.group_schedule,
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
      const userId: number | string = ctx.from?.id || 'Не указано';
      pushToStack(userId.toString(), 'participant'); // Добавляем состояние "participant"
      addToHistory(userId.toString(), key);

      try {
        if (key === 'participant_group_schedule') {
          console.log('Открытие расписания для участника');
          await handleButtonActionWithImage(
            ctx,
            'group_schedule',
            urls.group_schedule,
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
        const userId: number | string = ctx.from?.id || 'Не указано';
        pushToStack(userId.toString(), 'faq');
        addToHistory(userId.toString(), key);

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
        const userId: number | string = ctx.from?.id || 'Не указано';
        pushToStack(userId.toString(), 'about_aa');
        addToHistory(userId.toString(), key);

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
        const userId: number | string = ctx.from?.id || 'Не указано';
        pushToStack(userId.toString(), 'group_schedule');
        addToHistory(userId.toString(), key);

        await handleGroupInfo(ctx, key);
      } catch (error) {
        console.error(
          `Ошибка при регистрации обработчика для кнопки ${key}:`,
          error,
        );
      }
    });
  });

  // Регистрация обработчиков для кнопок Родственник
  buttonKeys.relative.forEach(key => {
    bot.action(key, async ctx => {
      try {
        const userId: number | string = ctx.from?.id || 'Не указано';
        pushToStack(userId.toString(), 'relative');
        addToHistory(userId.toString(), key);

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

  // Обработка нажатий на кнопку "Назад" для возврата к предыдущему сообщению
  bot.action('back', async ctx => {
    try {
      const previousState = popFromStack(ctx.from.id.toString()); // Извлекаем предыдущее состояние
      const userId: number | string = ctx.from?.id || 'Не указано';
      addToHistory(userId.toString(), 'back');

      if (previousState) {
        // В зависимости от предыдущего состояния, отправляем соответствующее сообщение
        if (previousState === 'welcome') {
          await ctx.deleteMessage();
          clearUserNavigationStack(ctx.from.id.toString());
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

  // Обработка других сообщений (если пользователь напишет что-то другое)
  bot.on('text', async ctx => {
    const userId: number | string = ctx.from?.id || 'Не указано';
    addToHistory(userId.toString(), 'text: ' + ctx.message.text);

    try {
      await sendWelcomeMessage(ctx);
    } catch (error) {
      console.error('Ошибка при обработке текстового сообщения:', error);
    }
  });

  // Обработка всех других возможных обращений (например, неизвестных кнопок, типов сообщений и т.д.)
  bot.on('message', async ctx => {
    const userId: number | string = ctx.from?.id || 'Не указано';
    addToHistory(userId.toString(), 'unknown_message');

    try {
      await ctx.reply(
        `🤔 Я пока не могу обработать это сообщение.  

Но я могу помочь вам вернуться в главное меню или связаться с участником АА (алкоголиком, который не пьет). 

Выберите, пожалуйста, подходящий вариант:`,
        Markup.inlineKeyboard([
          [Markup.button.callback('🏠 Главное меню', 'back')],
          [Markup.button.url('💬 Связаться с участником АА', urls.question)],
        ]),
      );
    } catch (error) {
      console.error('Ошибка при обработке неизвестного сообщения:', error);
    }
  });
};
