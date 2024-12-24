const { Markup } = require('telegraf');

// сообщения
const messages = {
  welcome: (firstName) => `👋 Привет, ${firstName}! 

🤖 Я бот содружества "Анонимные Алкоголики". Теперь твоя очередь представиться, кто ты?

👇 Нажми на кнопку ниже 👇`,

  newbie: 'Выбери пункт, который тебя интересует\nИнформационная линия +7800000000',
  participant: 'Вы выбрали "Участник". Как я могу помочь?',
  relative: 'Вы выбрали "Родственник". Как я могу помочь?',
  ask_question: 'Вы выбрали "Задать вопрос". Какой у вас вопрос?',

  want_to_quit: 'Вы выбрали "Хочу бросить пить". Мы рады, что вы сделали этот шаг! Как мы можем помочь?',
  about_aa: 'Вы выбрали "О программе АА". Анонимные Алкоголики — это сообщество людей, которые делятся своим опытом, силой и надеждой, чтобы решить общую проблему и помочь другим восстановиться от алкоголизма.',
  what_to_expect: 'Вы выбрали "Что ждать от собрания". На собрании вы можете ожидать поддержку, понимание и возможность поделиться своим опытом.',
  literature: 'Вы выбрали "Литература". Мы рекомендуем ознакомиться с книгами "Анонимные Алкоголики" и "12 шагов и 12 традиций".',
  group_schedule: 'Вы выбрали "Расписание групп". Пожалуйста, уточните, в каком городе вы ищете группы, и мы предоставим информацию.',
  faq: 'Вы выбрали "Вопрос - ответ". Пожалуйста, задайте ваш вопрос, и мы постараемся на него ответить.',
};

// Ключи для кнопок
const buttonKeys = {
  welcome: ['newbie', 'participant', 'relative', 'ask_question'],
  newbie:
    ['want_to_quit', 'about_aa', 'what_to_expect', 'literature', 'group_schedule', 'faq']
}

// Кнопки
const buttons = {
  // Приветствие
  welcome: [
    [Markup.button.callback('Новичок', 'newbie')],
    [Markup.button.callback('Член АА', 'participant')],
    [Markup.button.callback('Родственник / друг алкоголика', 'relative')],
    [Markup.button.callback('Хочу задать вопрос', 'ask_question')],
  ],

  // Приветствиe --> Новичок
  newbie: [
    [Markup.button.callback('Хочу бросить пить', 'want_to_quit')],
    [Markup.button.callback('О программе АА', 'about_aa')],
    [Markup.button.callback('Что ждать от собрания', 'what_to_expect')],
    [Markup.button.callback('Литература', 'literature')],
    [Markup.button.callback('Расписание групп', 'group_schedule')],
    [Markup.button.callback('Вопрос - ответ', 'faq')],
    [Markup.button.callback('⬅️ Назад', 'back_to_start')],
  ],
  // Приветствиe --> Участник
  participant: [
    [Markup.button.callback('⬅️ Назад', 'back_to_start')],
  ],
  // Приветствиe --> Родственник
  relative: [
    [Markup.button.callback('⬅️ Назад', 'back_to_start')],
  ],
  // Приветствиe --> Задать вопрос
  ask_question: [
    [Markup.button.callback('⬅️ Назад', 'back_to_start')],
  ],

  // Новичок --> Хочу бросить пить
  want_to_quit: [
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> О программе АА
  about_aa: [
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> Что ждать от собрания
  what_to_expect: [
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> Литература
  literature: [
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> Расписание групп
  group_schedule: [
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
  // Новичок --> Вопрос - ответ
  faq: [
    [Markup.button.callback('⬅️ Назад', 'newbie')],
  ],
};

module.exports = { messages, buttonKeys, buttons };
