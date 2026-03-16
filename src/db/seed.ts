import db, { initDatabase } from './database';
import { aaGroups, alAnonGroups, aaPhone } from '../data/groups';
import { messages } from '../data/messages';
import { urls } from '../data/urls';

export function seedDatabase(): void {
  const groupCount = (db.prepare('SELECT COUNT(*) as c FROM groups').get() as { c: number }).c;

  // Only seed if database is empty
  if (groupCount > 0) {
    console.log('База данных уже содержит данные, пропускаем seed.');
    return;
  }

  console.log('Заполняем базу данных начальными данными...');

  const insertGroup = db.prepare(`
    INSERT OR IGNORE INTO groups (key, type, name, address, description, map_link, video_path, image_url, phone, notes, city, sort_order)
    VALUES (@key, @type, @name, @address, @description, @map_link, @video_path, @image_url, @phone, @notes, @city, @sort_order)
  `);

  const insertSchedule = db.prepare(
    'INSERT INTO schedules (group_id, days, time) VALUES (?, ?, ?)'
  );

  const seedGroups = db.transaction(() => {
    // AA groups
    aaGroups.forEach((g, i) => {
      const result = insertGroup.run({
        key: g.key,
        type: 'aa',
        name: g.name,
        address: g.address,
        description: g.description,
        map_link: g.mapLink,
        video_path: g.videoPath,
        image_url: g.imageUrl,
        phone: g.phone,
        notes: g.notes,
        city: g.city,
        sort_order: i,
      });
      const groupId = result.lastInsertRowid as number;
      for (const s of g.schedule) {
        insertSchedule.run(groupId, JSON.stringify(s.days), s.time);
      }
    });

    // Al-Anon groups
    alAnonGroups.forEach((g, i) => {
      const result = insertGroup.run({
        key: g.key,
        type: 'alanon',
        name: g.name,
        address: g.address,
        description: g.description,
        map_link: g.mapLink,
        video_path: g.videoPath,
        image_url: g.imageUrl,
        phone: g.phone,
        notes: g.notes,
        city: g.city,
        sort_order: i,
      });
      const groupId = result.lastInsertRowid as number;
      for (const s of g.schedule) {
        insertSchedule.run(groupId, JSON.stringify(s.days), s.time);
      }
    });
  });

  seedGroups();

  // Seed messages (skip computed ones like answer_11 and alanon — they'll be generated dynamically)
  const insertMessage = db.prepare(`
    INSERT OR IGNORE INTO messages (key, value, description)
    VALUES (?, ?, ?)
  `);

  const seedMessages = db.transaction(() => {
    for (const [key, value] of Object.entries(messages)) {
      // Skip dynamically computed messages — they reference group data
      if (key === 'answer_11' || key === 'alanon') continue;
      insertMessage.run(key, value, '');
    }
  });

  seedMessages();

  // Seed URLs
  const insertUrl = db.prepare(`
    INSERT OR IGNORE INTO urls (key, value, description)
    VALUES (?, ?, ?)
  `);

  const seedUrls = db.transaction(() => {
    for (const [key, value] of Object.entries(urls)) {
      insertUrl.run(key, value, '');
    }
  });

  seedUrls();

  // Seed settings
  db.prepare(`
    INSERT OR IGNORE INTO settings (key, value, description)
    VALUES (?, ?, ?)
  `).run('aaPhone', aaPhone, 'Горячая линия АА');

  console.log('Seed завершён.');
}

// Allow running as standalone script
if (require.main === module) {
  initDatabase();
  seedDatabase();
  console.log('Done.');
}
