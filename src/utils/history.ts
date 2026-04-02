// src/utils/history.ts
import * as fs from 'fs';
import * as path from 'path';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import * as usersRepo from '../db/usersRepo';
import { messageCatalog } from '../i18n/messages';

// Track user action — saves to DB
export const addToHistory = (
  userId: string,
  action: string,
  firstName = '',
  lastName = '',
  username = '',
) => {
  try {
    usersRepo.trackUser(userId, firstName, lastName, username, action);
  } catch (error) {
    console.error(messageCatalog.history_write_error, error);
  }
  console.log(`[history] ${userId}: ${action}`);
};

// Write recent history to file (for sending to admin)
const writeHistoryToFile = async (bot: Telegraf<Context<Update>>) => {
  const filePath = path.join(process.cwd(), 'data', 'user_history.txt');

  const recentData = usersRepo.getRecentActions(3);

  if (recentData.length === 0) {
    return null;
  }

  let fileContent = messageCatalog.history_file_title;

  for (const { user, actions } of recentData) {
    const firstName = user.first_name || messageCatalog.history_not_specified;
    const username = user.username ? `@${user.username}` : messageCatalog.history_not_specified;
    fileContent += `${messageCatalog.history_user_label}${firstName}\n`;
    fileContent += `${messageCatalog.history_username_label}${username}\n`;
    fileContent += `${messageCatalog.history_id_label}${user.telegram_id}\n`;
    fileContent += `${messageCatalog.history_interaction_history_label}\n`;

    actions.forEach(({ created_at, action }) => {
      fileContent += `🕒 ${created_at} - ${action}\n`;
    });

    fileContent += '\n';
  }

  fs.writeFileSync(filePath, fileContent);
  return filePath;
};

export const sendStatisticsToAdmin = async (
  bot: Telegraf<Context<Update>>,
  tgId: string,
) => {
  try {
    const stats = usersRepo.getStats(3);
    const totalActions = stats.actions.reduce((sum, a) => sum + a.count, 0);

    if (totalActions === 0) {
      await bot.telegram.sendMessage(tgId, messageCatalog.history_no_visitors_3h);
      console.log(messageCatalog.history_empty_3h_log);
      return;
    }

    const topActions = stats.actions
      .slice(0, 10)
      .map((a) => `  • ${a.action} — ${a.count}`)
      .join('\n');

    const message =
      `${messageCatalog.history_stats_header_3h}` +
      `${messageCatalog.history_stats_users_label}${stats.active_users}\n` +
      `${messageCatalog.history_stats_actions_label}${totalActions}\n\n` +
      `${messageCatalog.history_stats_top_actions_label}\n${topActions}`;

    await bot.telegram.sendMessage(tgId, message);
    const sentLogMessage = messageCatalog.history_stats_sent_log_template
      .replace('{users}', String(stats.active_users))
      .replace('{actions}', String(totalActions));
    console.log(sentLogMessage);
  } catch (error) {
    console.error(messageCatalog.history_send_error, error);
  }
};
