import db from './database';
import { AdminRow } from '../types';

export function getAllAdmins(): AdminRow[] {
  return db.prepare('SELECT * FROM admins ORDER BY created_at').all() as AdminRow[];
}

export function isAdmin(telegramId: string): boolean {
  const row = db.prepare('SELECT 1 FROM admins WHERE telegram_id = ?').get(telegramId);
  return !!row;
}

export function addAdmin(telegramId: string, name?: string): void {
  db.prepare(`
    INSERT OR IGNORE INTO admins (telegram_id, name)
    VALUES (?, ?)
  `).run(telegramId, name || '');
}

export function removeAdmin(telegramId: string): boolean {
  return db.prepare('DELETE FROM admins WHERE telegram_id = ?').run(telegramId).changes > 0;
}
