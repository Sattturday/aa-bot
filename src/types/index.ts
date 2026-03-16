export interface GroupRow {
  id: number;
  key: string;
  type: 'aa' | 'alanon';
  name: string;
  address: string;
  description: string;
  map_link: string;
  video_path: string;
  image_url: string;
  phone: string;
  notes: string;
  city: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleRow {
  id: number;
  group_id: number;
  days: string; // JSON array: '["Пн","Вт"]'
  time: string;
}

export interface MessageRow {
  key: string;
  value: string;
  description: string;
}

export interface UrlRow {
  key: string;
  value: string;
  description: string;
}

export interface SettingRow {
  key: string;
  value: string;
  description: string;
}

export interface AdminRow {
  telegram_id: string;
  name: string;
  created_at: string;
}

export interface UserRow {
  telegram_id: string;
  first_name: string;
  last_name: string;
  username: string;
  first_seen: string;
  last_seen: string;
}

export interface UserActionRow {
  id: number;
  telegram_id: string;
  action: string;
  created_at: string;
}

// Group with parsed schedules (for bot consumption)
export interface GroupWithSchedule {
  id: number;
  key: string;
  type: 'aa' | 'alanon';
  name: string;
  address: string;
  description: string;
  mapLink: string;
  videoPath: string;
  imageUrl: string;
  phone: string;
  notes: string;
  city: string;
  sort_order: number;
  schedule: { days: string[]; time: string }[];
}
