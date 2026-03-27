import db from './database';
import { UrlRow } from '../types';

export function getAllUrls(): UrlRow[] {
  return db.prepare('SELECT * FROM urls ORDER BY key').all() as UrlRow[];
}

export function getUrl(key: string): string | null {
  const row = db.prepare('SELECT value FROM urls WHERE key = ?').get(key) as { value: string } | undefined;
  return row ? row.value : null;
}

export function upsertUrl(key: string, value: string, description?: string): void {
  db.prepare(`
    INSERT INTO urls (key, value, description)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, description = excluded.description
  `).run(key, value, description || '');
}

export function deleteUrl(key: string): boolean {
  return db.prepare('DELETE FROM urls WHERE key = ?').run(key).changes > 0;
}
