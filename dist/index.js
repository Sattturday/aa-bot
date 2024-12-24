"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const telegraf_1 = require("telegraf");
const messages_1 = require("./messages");
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
const bot = new telegraf_1.Telegraf(token);
// Функция для пересылки сообщений на ваш аккаунт
const forwardMessageToAdmin = (ctx, action) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userName = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name) || 'Не указано';
        const userId = ((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id) || 'Не указано';
        const userUsername = ((_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username)
            ? `@${ctx.from.username}`
            : 'Не указано';
        const message = `Пользователь: ${userName}\nUsername: ${userUsername}\nID: ${userId}\nДействие: ${action}`;
        yield bot.telegram.sendMessage(tgId, message);
    }
    catch (error) {
        console.error('Ошибка при пересылке сообщения администратору:', error);
    }
});
// Приветственное сообщение
const sendWelcomeMessage = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const firstName = ((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.first_name) || 'человек';
        const message = `👋 Привет, ${firstName}! 

🤖 Я бот содружества "Анонимные Алкоголики". Теперь твоя очередь представиться, кто ты?

👇 Нажми на кнопку ниже 👇`;
        yield ctx.reply(message, telegraf_1.Markup.inlineKeyboard(messages_1.buttons.welcome));
        // await forwardMessageToAdmin(ctx, 'welcome');
    }
    catch (error) {
        console.error('Ошибка при отправке приветственного сообщения:', error);
    }
});
// Универсальный обработчик для кнопок
const handleButtonAction = (ctx, key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ctx.deleteMessage();
        yield ctx.reply(messages_1.messages[key], telegraf_1.Markup.inlineKeyboard(messages_1.buttons[key]));
        // await forwardMessageToAdmin(ctx, key);
    }
    catch (error) {
        console.error(`Ошибка при обработке действия кнопки ${key}:`, error);
    }
});
// Регистрация обработчиков для кнопок Приветствие
messages_1.buttonKeys.welcome.forEach(key => {
    bot.action(key, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield handleButtonAction(ctx, key);
        }
        catch (error) {
            console.error(`Ошибка при регистрации обработчика для кнопки ${key}:`, error);
        }
    }));
});
// Регистрация обработчиков для кнопок Новичок
messages_1.buttonKeys.newbie.forEach(key => {
    bot.action(key, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield handleButtonAction(ctx, key);
        }
        catch (error) {
            console.error(`Ошибка при регистрации обработчика для кнопки ${key}:`, error);
        }
    }));
});
// Обработка нажатий на кнопку "Назад" для возврата к приветствию
bot.action('back_to_start', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ctx.deleteMessage();
        yield sendWelcomeMessage(ctx);
    }
    catch (error) {
        console.error('Ошибка при обработке кнопки "Назад":', error);
    }
}));
// Обработка других сообщений (если пользователь напишет что-то другое)
bot.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sendWelcomeMessage(ctx);
    }
    catch (error) {
        console.error('Ошибка при обработке текстового сообщения:', error);
    }
}));
// Запуск бота
bot.launch().catch(error => {
    console.error('Ошибка при запуске бота:', error);
});
console.log('Ура, бот запущен!');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
