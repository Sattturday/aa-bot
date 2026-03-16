import db from './database';
import { SettingRow } from '../types';

export function getAllSettings(): SettingRow[] {
  return db.prepare('SELECT * FROM settings ORDER BY key').all() as SettingRow[];
}

export function getSetting(key: string): string | null {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row ? row.value : null;
}

export function upsertSetting(key: string, value: string, description?: string): void {
  db.prepare(`
    INSERT INTO settings (key, value, description)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, description = excluded.description
  `).run(key, value, description || '');
}

export function deleteSetting(key: string): boolean {
  return db.prepare('DELETE FROM settings WHERE key = ?').run(key).changes > 0;
}
