import * as dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { initDatabase } from './db/database';
import { seedDatabase } from './db/seed';
import { addAdmin } from './db/adminsRepo';
import { registerAllHandlers } from './handlers/index';
import { messageCatalog } from './i18n/messages';
import { sendStatisticsToAdmin } from './utils/history';
import { createServer } from './server';

dotenv.config();

const token = process.env.BOT_TOKEN;
const tgId = process.env.TG_ID;
const port = parseInt(process.env.PORT || '5000', 10);
const adminIds = process.env.ADMIN_IDS || '';

if (!token || !tgId) {
  console.error(messageCatalog.app_env_missing_error);
  process.exit(1);
}

// Initialize database and seed data
initDatabase();
seedDatabase();

// Seed initial admins from env
if (adminIds) {
  for (const id of adminIds.split(',').map(s => s.trim()).filter(Boolean)) {
    addAdmin(id);
  }
}
// Always add TG_ID as admin
addAdmin(tgId);

const bot = new Telegraf(token);

// Регистрация обработчиков кнопок
registerAllHandlers(bot);

// Отправляем статистику каждые 3 часа
setInterval(() => sendStatisticsToAdmin(bot, tgId), 3 * 60 * 60 * 1000);

// Start Express server for API and admin panel
const app = createServer(bot);
app.listen(port, () => {
  console.log(`${messageCatalog.app_express_started_prefix}${port}`);
});

// Функция для запуска бота с перезапуском в случае ошибки
async function startBot() {
  try {
    console.log(messageCatalog.app_bot_starting);

    if (tgId) {
      await bot.telegram.sendMessage(tgId, messageCatalog.app_bot_started);
    }

    await bot.launch();
  } catch (error) {
    console.error(messageCatalog.app_bot_start_error, error);
    console.log(messageCatalog.app_bot_restart_in_1m);
    setTimeout(startBot, 60 * 1000);
  }
}

// Обработка сигналов завершения процесса
process.on('SIGINT', async () => {
  console.log(messageCatalog.app_sigint_received);
  await bot.stop();
  process.exit();
});

process.on('SIGTERM', async () => {
  console.log(messageCatalog.app_sigterm_received);
  await bot.stop();
  process.exit();
});

// Запускаем бота
startBot();
