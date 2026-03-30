import { DataCache } from '../utils/cache';
import * as groupsRepo from './groupsRepo';
import * as messagesRepo from './messagesRepo';
import * as urlsRepo from './urlsRepo';
import * as settingsRepo from './settingsRepo';
import { GroupWithSchedule } from '../types';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf';

// --- Caches ---

const aaGroupsCache = new DataCache(() => groupsRepo.getGroupsByType('aa'));
const alAnonGroupsCache = new DataCache(() => groupsRepo.getGroupsByType('alanon'));

const messagesCache = new DataCache(() => {
  const rows = messagesRepo.getAllMessages();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});

const urlsCache = new DataCache(() => {
  const rows = urlsRepo.getAllUrls();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});

const settingsCache = new DataCache(() => {
  const rows = settingsRepo.getAllSettings();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
});

// --- Public API ---

export function getAaGroups(): GroupWithSchedule[] {
  return aaGroupsCache.get();
}

export function getAlAnonGroups(): GroupWithSchedule[] {
  return alAnonGroupsCache.get();
}

export function getAaPhone(): string {
  return settingsCache.get()['aaPhone'] || '';
}

export function getMessageText(key: string): string {
  // Dynamic computed messages
  if (key === 'answer_11') {
    return generateGroupScheduleMessage(
      `🙏 Остаться трезвым непросто, но Вы не одни. Группы АА поддержат Вас на пути к выздоровлению.\n\n📞 Горячая линия ${getAaPhone()}\n\n`,
      getAaGroups(),
    );
  }
  if (key === 'alanon') {
    const staticPart = messagesCache.get()['alanon'] || '';
    const schedule = generateGroupScheduleMessage(
      '🙏 Группы для родственников алкоголиков. Приходите, мы вам рады.\n\n',
      getAlAnonGroups(),
    );
    return staticPart + schedule;
  }
  if (key === 'newbie') {
    return `😊 Выбери пункт, который тебя интересует\n\n📞 Горячая линия ${getAaPhone()}`;
  }

  return messagesCache.get()[key] || '';
}

export function getUrlValue(key: string): string {
  return urlsCache.get()[key] || '';
}

export function getAllUrlValues(): Record<string, string> {
  return urlsCache.get();
}

// Generate group schedule buttons dynamically
export function getGroupScheduleButtons(): InlineKeyboardButton[][] {
  const groups = getAaGroups();
  const rows: InlineKeyboardButton[][] = groups.map(g =>
    [Markup.button.callback(g.city ? `Группа "${g.name}" (${g.city})` : `Группа "${g.name}"`, g.key)]
  );
  rows.push([Markup.button.callback('⬅️ Назад', 'back')]);
  return rows;
}

// Generate group schedule button keys dynamically
export function getGroupScheduleKeys(): string[] {
  return getAaGroups().map(g => g.key);
}

// --- Invalidation ---

export function invalidateGroups(): void {
  aaGroupsCache.invalidate();
  alAnonGroupsCache.invalidate();
}

export function invalidateMessages(): void {
  messagesCache.invalidate();
}

export function invalidateUrls(): void {
  urlsCache.invalidate();
}

export function invalidateSettings(): void {
  settingsCache.invalidate();
}

export function invalidateAll(): void {
  invalidateGroups();
  invalidateMessages();
  invalidateUrls();
  invalidateSettings();
}

// --- Helper ---

export function getGroupPhone(group: GroupWithSchedule): string {
  return group.phone || getAaPhone();
}

export function generateGroupScheduleMessage(header: string, groups: GroupWithSchedule[]): string {
  const groupMessages = groups
    .map((group, index) => {
      const scheduleText = group.schedule
        .map(s => `${s.days.join(', ')} в ${s.time}`)
        .join('; ');
      return `${index + 1}️⃣ Группа "${group.name}"\n📍${group.address}\n🚩${
        group.description ? group.description : '---'
      }\n🕖 ${scheduleText}\n📞${getGroupPhone(group)}\n`;
    })
    .join('\n');

  return header + groupMessages;
}
