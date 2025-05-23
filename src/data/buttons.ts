import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { urls } from './urls';

type ButtonRow = InlineKeyboardButton[];
type Buttons = {
  [key: string]: ButtonRow[];
};

export const buttons: Buttons = {
  // Старт
  start: [[Markup.button.callback('Продолжить ➡️', 'welcome')]],
  // Приветствие
  welcome: [
    [Markup.button.callback('🆕 Новичок', 'newbie')],
    [Markup.button.callback('😊 Член АА', 'participant')],
    [Markup.button.callback('❤️ Родственник / друг алкоголика', 'relative')],
    [Markup.button.url('❓ Хочу задать вопрос', urls.question)],
    [Markup.button.url('⚙️ Техподдержка бота', urls.support)],
  ],
  // Приветствиe --> Новичок
  newbie: [
    [Markup.button.callback('🙏 Хочу бросить пить', 'want_to_quit')],
    [Markup.button.callback('🖐 О программе АА', 'newbie_about_aa')],
    [Markup.button.callback('🗣 Что ждать от собрания', 'what_to_expect')],
    [Markup.button.callback('📚 Литература', 'newbie_literature')],
    [Markup.button.callback('🗓 Расписание групп', 'newbie_group_schedule')],
    [Markup.button.callback('❓ Вопрос - ответ', 'faq')],
    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствиe --> Новичок --> Хочу бросить пить
  want_to_quit: [
    [Markup.button.url('🌍 Узнать больше на сайте', urls.hochu_brosit)],
    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствиe --> Новичок --> О программе АА
  about_aa: [
    [Markup.button.callback('12 шагов', 'steps')],
    [Markup.button.url('🌍 Узнать больше на сайте', urls.about_aa)],
    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствиe --> О программе АА --> 12 шагов
  steps: [[Markup.button.callback('⬅️ Назад', 'back')]],
  // Приветствиe --> Новичок --> Что ждать от собрания
  what_to_expect: [
    [Markup.button.url('🌍 Узнать больше на сайте', urls.o_sobranii)],
    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствиe --> Новичок --> Литература
  literature: [
    [Markup.button.url('📚 "Электронная библиотека АА', urls.literatura)],
    [Markup.button.url('🛍 "Заказать литературу АА', urls.buy_literature)],
    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствиe --> Новичок --> Расписание групп
  group_schedule: [
    [Markup.button.callback('Группа "12:21"', 'group_12_21')],
    [Markup.button.callback('Группа "Выход есть"', 'group_exit')],
    [Markup.button.callback('Группа "Ступени"', 'group_steps')],
    [Markup.button.callback('Группа "Ночная"', 'group_nochnaya')],
    [Markup.button.callback('Группа "Источник"', 'group_istochnik')],
    [Markup.button.callback('Группа "Август"', 'group_avgust')],
    [Markup.button.callback('Группа "Спутник"', 'group_sputnik')],
    [Markup.button.callback('Группа "Ирек"', 'group_irek')],

    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствиe --> Новичок --> Вопрос - ответ
  faq: [
    [Markup.button.callback('🙏 Алкоголик ли я?', 'answer_1')],
    [Markup.button.callback('📖 Что такое АА?', 'answer_2')],
    [Markup.button.callback('👥 Вдруг встречу знакомых?', 'answer_3')],
    [Markup.button.callback('🗣 Что происходит на собраниях?', 'answer_4')],
    [Markup.button.callback('🚫 Как это поможет бросить пить?', 'answer_5')],
    [Markup.button.callback('🤝 Зачем приходят исцелившиеся?', 'answer_6')],
    [Markup.button.callback('🆕 Как вступить в АА?', 'answer_7')],
    [Markup.button.callback('💰 Членские взносы?', 'answer_8')],
    [Markup.button.callback('💒 АА религиозная организация?', 'answer_9')],
    [Markup.button.callback('👨‍👩‍👧 Можно с семьей?', 'answer_10')],
    [Markup.button.callback('📞 Как связаться с АА?', 'answer_11')],

    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствиe --> Новичок --> Вопрос - ответ --> ...
  answer_1: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_2: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_3: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_4: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_5: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_6: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_7: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_8: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_9: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_10: [[Markup.button.callback('⬅️ Назад', 'back')]],
  answer_11: [[Markup.button.callback('⬅️ Назад', 'back')]],

  // Приветствиe --> Участник
  participant: [
    [
      Markup.button.callback(
        '🗓 Расписание групп',
        'participant_group_schedule',
      ),
    ],
    [Markup.button.callback('🙏 Хочу взять служение', 'service')],
    [Markup.button.url('🖐 Ежедневные размышления', urls.daily)],
    [Markup.button.callback('☀️ 11 шаг (утро)', 'step_11_am')],
    [Markup.button.callback('🌙 11 шаг (вечер)', 'step_11_pm')],
    [Markup.button.callback('📚 Литература', 'participant_literature')],

    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствие --> Участник --> Хочу взять служение
  service: [[Markup.button.callback('⬅️ Назад', 'back')]],
  //  Приветствие --> Участник --> 11 шаг (утро)
  step_11_am: [[Markup.button.callback('⬅️ Назад', 'back')]],
  // Приветствие --> Участник --> 11 шаг (вечер)
  step_11_pm: [[Markup.button.callback('⬅️ Назад', 'back')]],
  // Приветствиe --> Родственник
  relative: [
    [Markup.button.callback('🖐 О программе АА', 'relative_about_aa')],
    [
      Markup.button.callback(
        '👥 Посетить открытое собрание АА',
        'open_meeting',
      ),
    ],
    [Markup.button.callback('🗓 Расписание Ал-Анон', 'alanon')],
    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствие --> Родственник --> Посетить открытое собрание АА
  open_meeting: [
    [Markup.button.url('🗓 Даты открытых собраний', urls.open_meeting)],
    [Markup.button.callback('⬅️ Назад', 'back')],
  ],
  // Приветствие --> Родственник --> Ал-Анон
  alanon: [[Markup.button.callback('⬅️ Назад', 'back')]],
  // Приветствиe --> Задать вопрос
  ask_question: [[Markup.button.callback('⬅️ Назад', 'back')]],
};
