import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { messageCatalog } from '../i18n/messages';
import { urls } from './urls';

type ButtonRow = InlineKeyboardButton[];
type Buttons = {
  [key: string]: ButtonRow[];
};

export const buttons: Buttons = {
  // Старт
  start: [[Markup.button.callback(messageCatalog.button_start_continue, 'welcome')]],
  // Приветствие
  welcome: [
    [Markup.button.callback(messageCatalog.button_welcome_newbie, 'newbie')],
    [Markup.button.callback(messageCatalog.button_welcome_participant, 'participant')],
    [Markup.button.callback(messageCatalog.button_welcome_relative, 'relative')],
    [Markup.button.url(messageCatalog.button_welcome_ask_question, urls.question)],
    [Markup.button.url(messageCatalog.button_welcome_support, urls.support)],
  ],
  // Приветствиe --> Новичок
  newbie: [
    [Markup.button.callback(messageCatalog.button_newbie_want_to_quit, 'want_to_quit')],
    [Markup.button.callback(messageCatalog.button_newbie_about_aa, 'newbie_about_aa')],
    [Markup.button.callback(messageCatalog.button_newbie_what_to_expect, 'what_to_expect')],
    [Markup.button.callback(messageCatalog.button_newbie_literature, 'newbie_literature')],
    [Markup.button.callback(messageCatalog.button_newbie_schedule, 'newbie_group_schedule')],
    [Markup.button.callback(messageCatalog.button_newbie_faq, 'faq')],
    [Markup.button.callback(messageCatalog.button_common_back, 'back')],
  ],
  // Приветствиe --> Новичок --> Хочу бросить пить
  want_to_quit: [
    [Markup.button.url(messageCatalog.button_learn_more_site, urls.hochu_brosit)],
    [Markup.button.callback(messageCatalog.button_common_back, 'back')],
  ],
  // Приветствиe --> Новичок --> О программе АА
  about_aa: [
    [Markup.button.callback(messageCatalog.button_steps, 'steps')],
    [Markup.button.url(messageCatalog.button_learn_more_site, urls.about_aa)],
    [Markup.button.callback(messageCatalog.button_common_back, 'back')],
  ],
  // Приветствиe --> О программе АА --> 12 шагов
  steps: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  // Приветствиe --> Новичок --> Что ждать от собрания
  what_to_expect: [
    [Markup.button.url(messageCatalog.button_learn_more_site, urls.o_sobranii)],
    [Markup.button.callback(messageCatalog.button_common_back, 'back')],
  ],
  // Приветствиe --> Новичок --> Литература
  literature: [
    [Markup.button.url(messageCatalog.button_literature_online, urls.literatura)],
    [Markup.button.url(messageCatalog.button_literature_order, urls.buy_literature)],
    [Markup.button.callback(messageCatalog.button_common_back, 'back')],
  ],
  // group_schedule кнопки генерируются динамически из БД (см. dataProvider.getGroupScheduleButtons)
  // Приветствиe --> Новичок --> Вопрос - ответ
  faq: [
    [Markup.button.callback(messageCatalog.button_faq_answer_1, 'answer_1')],
    [Markup.button.callback(messageCatalog.button_faq_answer_2, 'answer_2')],
    [Markup.button.callback(messageCatalog.button_faq_answer_3, 'answer_3')],
    [Markup.button.callback(messageCatalog.button_faq_answer_4, 'answer_4')],
    [Markup.button.callback(messageCatalog.button_faq_answer_5, 'answer_5')],
    [Markup.button.callback(messageCatalog.button_faq_answer_6, 'answer_6')],
    [Markup.button.callback(messageCatalog.button_faq_answer_7, 'answer_7')],
    [Markup.button.callback(messageCatalog.button_faq_answer_8, 'answer_8')],
    [Markup.button.callback(messageCatalog.button_faq_answer_9, 'answer_9')],
    [Markup.button.callback(messageCatalog.button_faq_answer_10, 'answer_10')],
    [Markup.button.callback(messageCatalog.button_faq_answer_11, 'answer_11')],

    [Markup.button.callback(messageCatalog.button_common_back, 'back')],
  ],
  // Приветствиe --> Новичок --> Вопрос - ответ --> ...
  answer_1: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_2: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_3: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_4: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_5: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_6: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_7: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_8: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_9: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_10: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  answer_11: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],

  // Приветствиe --> Участник
  participant: [
    [
      Markup.button.callback(
        messageCatalog.button_participant_schedule,
        'participant_group_schedule',
      ),
    ],
    [Markup.button.callback(messageCatalog.button_participant_service, 'service')],
    [Markup.button.url(messageCatalog.button_participant_daily, urls.daily)],
    [Markup.button.callback(messageCatalog.button_participant_step_11_am, 'step_11_am')],
    [Markup.button.callback(messageCatalog.button_participant_step_11_pm, 'step_11_pm')],
    [Markup.button.callback(messageCatalog.button_participant_literature, 'participant_literature')],

    [Markup.button.callback(messageCatalog.button_common_back, 'back')],
  ],
  // Приветствие --> Участник --> Хочу взять служение
  service: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  //  Приветствие --> Участник --> 11 шаг (утро)
  step_11_am: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  // Приветствие --> Участник --> 11 шаг (вечер)
  step_11_pm: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  // Приветствиe --> Родственник
  relative: [
    [Markup.button.callback(messageCatalog.button_relative_about_aa, 'relative_about_aa')],
    [
      Markup.button.callback(
        messageCatalog.button_relative_open_meeting,
        'open_meeting',
      ),
    ],
    [Markup.button.callback(messageCatalog.button_relative_alanon_schedule, 'alanon')],
    [Markup.button.callback(messageCatalog.button_common_back, 'back')],
  ],
  // Приветствие --> Родственник --> Посетить открытое собрание АА
  open_meeting: [
    [Markup.button.url(messageCatalog.button_relative_open_meeting_dates, urls.open_meeting)],
    [Markup.button.callback(messageCatalog.button_common_back, 'back')],
  ],
  // Приветствие --> Родственник --> Ал-Анон
  alanon: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
  // Приветствиe --> Задать вопрос
  ask_question: [[Markup.button.callback(messageCatalog.button_common_back, 'back')]],
};
