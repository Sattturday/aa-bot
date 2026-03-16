import db from './database';
import { GroupRow, ScheduleRow, GroupWithSchedule } from '../types';

function toGroupWithSchedule(group: GroupRow, schedules: ScheduleRow[]): GroupWithSchedule {
  return {
    id: group.id,
    key: group.key,
    type: group.type,
    name: group.name,
    address: group.address,
    description: group.description,
    mapLink: group.map_link,
    videoPath: group.video_path,
    imageUrl: group.image_url,
    phone: group.phone,
    notes: group.notes,
    city: group.city,
    sort_order: group.sort_order,
    schedule: schedules.map(s => ({
      days: JSON.parse(s.days) as string[],
      time: s.time,
    })),
  };
}

export function getAllGroups(): GroupWithSchedule[] {
  const groups = db.prepare('SELECT * FROM groups ORDER BY sort_order, id').all() as GroupRow[];
  return groups.map(g => {
    const schedules = db.prepare('SELECT * FROM schedules WHERE group_id = ?').all(g.id) as ScheduleRow[];
    return toGroupWithSchedule(g, schedules);
  });
}

export function getGroupsByType(type: 'aa' | 'alanon'): GroupWithSchedule[] {
  const groups = db.prepare('SELECT * FROM groups WHERE type = ? ORDER BY sort_order, id').all(type) as GroupRow[];
  return groups.map(g => {
    const schedules = db.prepare('SELECT * FROM schedules WHERE group_id = ?').all(g.id) as ScheduleRow[];
    return toGroupWithSchedule(g, schedules);
  });
}

export function getGroupById(id: number): GroupWithSchedule | null {
  const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(id) as GroupRow | undefined;
  if (!group) return null;
  const schedules = db.prepare('SELECT * FROM schedules WHERE group_id = ?').all(group.id) as ScheduleRow[];
  return toGroupWithSchedule(group, schedules);
}

export function getGroupByKey(key: string): GroupWithSchedule | null {
  const group = db.prepare('SELECT * FROM groups WHERE key = ?').get(key) as GroupRow | undefined;
  if (!group) return null;
  const schedules = db.prepare('SELECT * FROM schedules WHERE group_id = ?').all(group.id) as ScheduleRow[];
  return toGroupWithSchedule(group, schedules);
}

export function createGroup(data: {
  key: string;
  type: 'aa' | 'alanon';
  name: string;
  address?: string;
  description?: string;
  map_link?: string;
  video_path?: string;
  image_url?: string;
  phone?: string;
  notes?: string;
  city?: string;
  sort_order?: number;
  schedule?: { days: string[]; time: string }[];
}): GroupWithSchedule {
  const insert = db.prepare(`
    INSERT INTO groups (key, type, name, address, description, map_link, video_path, image_url, phone, notes, city, sort_order)
    VALUES (@key, @type, @name, @address, @description, @map_link, @video_path, @image_url, @phone, @notes, @city, @sort_order)
  `);

  const insertSchedule = db.prepare('INSERT INTO schedules (group_id, days, time) VALUES (?, ?, ?)');

  const transaction = db.transaction(() => {
    const result = insert.run({
      key: data.key,
      type: data.type,
      name: data.name,
      address: data.address || '',
      description: data.description || '',
      map_link: data.map_link || '',
      video_path: data.video_path || '',
      image_url: data.image_url || '',
      phone: data.phone || '',
      notes: data.notes || '',
      city: data.city || '',
      sort_order: data.sort_order || 0,
    });

    const groupId = result.lastInsertRowid as number;

    if (data.schedule) {
      for (const s of data.schedule) {
        insertSchedule.run(groupId, JSON.stringify(s.days), s.time);
      }
    }

    return groupId;
  });

  const groupId = transaction();
  return getGroupById(groupId)!;
}

const ALLOWED_GROUP_FIELDS = new Set([
  'key', 'type', 'name', 'address', 'description', 'map_link',
  'video_path', 'image_url', 'phone', 'notes', 'city', 'sort_order',
]);

export function updateGroup(id: number, data: {
  key?: string;
  type?: 'aa' | 'alanon';
  name?: string;
  address?: string;
  description?: string;
  map_link?: string;
  video_path?: string;
  image_url?: string;
  phone?: string;
  notes?: string;
  city?: string;
  sort_order?: number;
}): GroupWithSchedule | null {
  const fields: string[] = [];
  const values: Record<string, unknown> = { id };

  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined && ALLOWED_GROUP_FIELDS.has(k)) {
      fields.push(`${k} = @${k}`);
      values[k] = v;
    }
  }

  if (fields.length === 0) return getGroupById(id);

  fields.push("updated_at = datetime('now')");
  db.prepare(`UPDATE groups SET ${fields.join(', ')} WHERE id = @id`).run(values);
  return getGroupById(id);
}

export function deleteGroup(id: number): boolean {
  const result = db.prepare('DELETE FROM groups WHERE id = ?').run(id);
  return result.changes > 0;
}

export function replaceSchedules(groupId: number, schedules: { days: string[]; time: string }[]): void {
  const del = db.prepare('DELETE FROM schedules WHERE group_id = ?');
  const ins = db.prepare('INSERT INTO schedules (group_id, days, time) VALUES (?, ?, ?)');

  const transaction = db.transaction(() => {
    del.run(groupId);
    for (const s of schedules) {
      ins.run(groupId, JSON.stringify(s.days), s.time);
    }
  });

  transaction();
}
