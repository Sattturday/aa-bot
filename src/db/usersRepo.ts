import db from './database';
import { UserRow, UserActionRow } from '../types';

export function upsertUser(telegramId: string, firstName: string, lastName: string, username: string): void {
  db.prepare(`
    INSERT INTO users (telegram_id, first_name, last_name, username)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(telegram_id) DO UPDATE SET
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      username = excluded.username,
      last_seen = datetime('now')
  `).run(telegramId, firstName, lastName, username);
}

export function addUserAction(telegramId: string, action: string): void {
  db.prepare('INSERT INTO user_actions (telegram_id, action) VALUES (?, ?)').run(telegramId, action);
}

export function trackUser(
  telegramId: string,
  firstName: string,
  lastName: string,
  username: string,
  action: string,
): void {
  const transaction = db.transaction(() => {
    upsertUser(telegramId, firstName, lastName, username);
    addUserAction(telegramId, action);
  });
  transaction();
}

export function getAllUsers(limit = 100, offset = 0): UserRow[] {
  return db.prepare('SELECT * FROM users ORDER BY last_seen DESC LIMIT ? OFFSET ?').all(limit, offset) as UserRow[];
}

export function getUserCount(): number {
  const row = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  return row.count;
}

export function getUserActions(telegramId: string, limit = 100): UserActionRow[] {
  return db.prepare(
    'SELECT * FROM user_actions WHERE telegram_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(telegramId, limit) as UserActionRow[];
}

export function getRecentActions(sinceHours = 3): { user: UserRow; actions: UserActionRow[] }[] {
  const cutoff = new Date(Date.now() - sinceHours * 60 * 60 * 1000).toISOString();
  const userIds = db.prepare(
    'SELECT DISTINCT telegram_id FROM user_actions WHERE created_at > ? ORDER BY telegram_id'
  ).all(cutoff) as { telegram_id: string }[];

  return userIds.map(({ telegram_id }) => {
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegram_id) as UserRow;
    const actions = db.prepare(
      'SELECT * FROM user_actions WHERE telegram_id = ? AND created_at > ? ORDER BY created_at'
    ).all(telegram_id, cutoff) as UserActionRow[];
    return { user, actions };
  });
}

export function getStats(sinceHours?: number): {
  totalUsers: number;
  activeUsers: number;
  totalActions: number;
} {
  const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;

  if (sinceHours) {
    const cutoff = new Date(Date.now() - sinceHours * 60 * 60 * 1000).toISOString();
    const activeUsers = (db.prepare('SELECT COUNT(DISTINCT telegram_id) as c FROM user_actions WHERE created_at > ?').get(cutoff) as { c: number }).c;
    const totalActions = (db.prepare('SELECT COUNT(*) as c FROM user_actions WHERE created_at > ?').get(cutoff) as { c: number }).c;
    return { totalUsers, activeUsers, totalActions };
  }

  const totalActions = (db.prepare('SELECT COUNT(*) as c FROM user_actions').get() as { c: number }).c;
  return { totalUsers, activeUsers: totalUsers, totalActions };
}
