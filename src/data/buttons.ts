import { Markup } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { urls } from "./urls";

type ButtonRow = InlineKeyboardButton[];
type Buttons = {
  [key: string]: ButtonRow[];
};

export const buttons: Buttons = {
  // Приветствие
  welcome: [
    [Markup.button.callback('🆕 Новичок', 'newbie')],
    [Markup.button.callback('😊 Член АА', 'participant')],
    [Markup.button.callback('❤️ Родственник / друг алкоголика', 'relative')],
    [Markup.button.url('❓ Хочу задать вопрос', 'https://t.me/AAchuvashii')],
    [Markup.button.url('⚙️ Техподдержка бота', 'https://t.me/+HaoOC7NG0vE2Nzdi')]
  ],
  // Приветствиe --> Новичок
  newbie: [
    [Markup.button.callback('🙏 Хочу бросить пить', 'want_to_quit')],
    [Markup.button.callback('🖐 О программе АА', 'about_aa')],
    [Markup.button.callback('🗣 Что ждать от собрания', 'what_to_expect')],
    [Markup.button.callback('📚 Литература', 'literature')],
    [Markup.button.callback('🗓 Расписание групп', 'group_schedule')],
    [Markup.button.callback('❓ Вопрос - ответ', 'faq')],
    [Markup.button.callback('⬅️ Назад', 'back_to_start')],
  ],
  // Приветствиe --> Участник
  participant: [
    [Markup.button.callback('🗓 Расписание групп', 'group_schedule')],
    [Markup.button.callback('🙏 Хочу взять служение', 'service')],
    [Markup.button.callback('☀️ 11 шаг (утро)', 'step_11_am')],
    [Markup.button.callback('🌙 11 шаг (вечер)', 'step_11_pm')],
    [Markup.button.callback('📚 Литература', 'literature')],

    [Markup.button.callback('⬅️ Назад', 'back_to_start')]
  ],
  // Приветствие --> Участник --> Хочу взять служение
  service: [[Markup.button.callback('⬅️ Назад', 'participant')]],
  //  Приветствие --> Участник --> 11 шаг (утро)
  step_11_am: [[Markup.button.callback('⬅️ Назад', 'participant')]],
  // Приветствие --> Участник --> 11 шаг (вечер)
  step_11_pm: [[Markup.button.callback('⬅️ Назад', 'participant')]],
  // Приветствиe --> Родственник
  relative: [[Markup.button.callback('⬅️ Назад', 'back_to_start')]],
  // Приветствиe --> Задать вопрос
  ask_question: [[Markup.button.callback('⬅️ Назад', 'back_to_start')]],

  // Новичок --> Хочу бросить пить
  want_to_quit: [
    [Markup.button.url('🌍 Узнать больше на сайте', urls.hochu_brosit)],
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> О программе АА
  about_aa: [
    [Markup.button.callback('12 шагов', 'steps')],
    [Markup.button.url('🌍 Узнать больше на сайте', urls.about_aa)],
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // О программе АА --> 12 шагов
  steps: [[Markup.button.callback('⬅️ Назад', 'about_aa')]],
  // Новичок --> Что ждать от собрания
  what_to_expect: [
    [Markup.button.url('🌍 Узнать больше на сайте', urls.o_sobranii)],
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> Литература
  literature: [
    [Markup.button.url('📚 Литература Содружества АА', urls.literatura)],
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> Расписание групп
  group_schedule: [
    [Markup.button.callback('Группа "12:21"', 'group_12_21')],
    [Markup.button.callback('Группа "Выход есть"', 'group_exit')],
    [Markup.button.callback('Группа "Ступени"', 'group_steps')],
    [Markup.button.callback('Группа "Ночная"', 'group_nochnaya')],
    [Markup.button.callback('Группа "Источник"', 'group_istochnik')],
    [Markup.button.callback('Группа "Август"', 'group_avgust')],
    [Markup.button.callback('Группа "Набережная"', 'group_naberezhnaya')],
    [Markup.button.callback('Группа "Новая"', 'group_novaya')],
    [Markup.button.callback('Группа "Ирек"', 'group_irek')],

    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> Вопрос - ответ
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

    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> Вопрос - ответ --> ... 
  answer_1: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_2: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_3: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_4: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_5: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_6: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_7: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_8: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_9: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_10: [[Markup.button.callback('⬅️ Назад', 'faq')]],
  answer_11: [[Markup.button.callback('⬅️ Назад', 'faq')]],
};