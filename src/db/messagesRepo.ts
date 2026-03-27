import db from './database';
import { MessageRow } from '../types';

export function getAllMessages(): MessageRow[] {
  return db.prepare('SELECT * FROM messages ORDER BY key').all() as MessageRow[];
}

export function getMessage(key: string): string | null {
  const row = db.prepare('SELECT value FROM messages WHERE key = ?').get(key) as { value: string } | undefined;
  return row ? row.value : null;
}

export function upsertMessage(key: string, value: string, description?: string): void {
  db.prepare(`
    INSERT INTO messages (key, value, description)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, description = excluded.description
  `).run(key, value, description || '');
}

export function deleteMessage(key: string): boolean {
  return db.prepare('DELETE FROM messages WHERE key = ?').run(key).changes > 0;
}
