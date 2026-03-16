// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
}

export interface ScheduleRow {
  id: number;
  group_id: number;
  days: string;
  time: string;
}

export interface GroupWithSchedules extends GroupRow {
  schedules: ScheduleRow[];
}

// ---------------------------------------------------------------------------
// Token management
// ---------------------------------------------------------------------------

let token: string | null = null;

export function setToken(t: string | null): void {
  token = t;
}

export function getToken(): string | null {
  return token;
}

// ---------------------------------------------------------------------------
// Base fetch wrapper
// ---------------------------------------------------------------------------

const BASE_URL = '/api';

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    setToken(null);
    // Redirect to root so the app can re-authenticate
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  // Some endpoints may return 204 No Content
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function validateAuth(
  initData: string,
): Promise<{ token: string }> {
  return request<{ token: string }>('/auth/validate', {
    method: 'POST',
    body: JSON.stringify({ initData }),
  });
}

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

export async function fetchGroups(
  type?: string,
): Promise<GroupWithSchedules[]> {
  const query = type ? `?type=${encodeURIComponent(type)}` : '';
  return request<GroupWithSchedules[]>(`/groups${query}`);
}

export async function fetchGroup(id: number): Promise<GroupWithSchedules> {
  return request<GroupWithSchedules>(`/groups/${id}`);
}

export async function createGroup(
  data: Partial<Omit<GroupRow, 'id'>>,
): Promise<GroupRow> {
  return request<GroupRow>('/groups', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateGroup(
  id: number,
  data: Partial<Omit<GroupRow, 'id'>>,
): Promise<GroupRow> {
  return request<GroupRow>(`/groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteGroup(id: number): Promise<void> {
  return request<void>(`/groups/${id}`, { method: 'DELETE' });
}

export async function replaceSchedules(
  groupId: number,
  schedules: Omit<ScheduleRow, 'id' | 'group_id'>[],
): Promise<ScheduleRow[]> {
  return request<ScheduleRow[]>(`/groups/${groupId}/schedules`, {
    method: 'PUT',
    body: JSON.stringify({ schedules }),
  });
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export interface MessageRow {
  key: string;
  value: string;
}

export async function fetchMessages(): Promise<MessageRow[]> {
  return request<MessageRow[]>('/messages');
}

export async function updateMessage(
  key: string,
  value: string,
): Promise<MessageRow> {
  return request<MessageRow>(`/messages/${encodeURIComponent(key)}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });
}

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

export interface UrlRow {
  key: string;
  value: string;
}

export async function fetchUrls(): Promise<UrlRow[]> {
  return request<UrlRow[]>('/urls');
}

export async function updateUrl(
  key: string,
  value: string,
): Promise<UrlRow> {
  return request<UrlRow>(`/urls/${encodeURIComponent(key)}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface SettingRow {
  key: string;
  value: string;
}

export async function fetchSettings(): Promise<SettingRow[]> {
  return request<SettingRow[]>('/settings');
}

export async function updateSetting(
  key: string,
  value: string,
): Promise<SettingRow> {
  return request<SettingRow>(`/settings/${encodeURIComponent(key)}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });
}

// ---------------------------------------------------------------------------
// Admins
// ---------------------------------------------------------------------------

export interface AdminRow {
  telegram_id: number;
  name: string;
}

export async function fetchAdmins(): Promise<AdminRow[]> {
  return request<AdminRow[]>('/admins');
}

export async function addAdmin(
  telegram_id: number,
  name: string,
): Promise<AdminRow> {
  return request<AdminRow>('/admins', {
    method: 'POST',
    body: JSON.stringify({ telegram_id, name }),
  });
}

export async function removeAdmin(telegram_id: number): Promise<void> {
  return request<void>(`/admins/${telegram_id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Users & Stats
// ---------------------------------------------------------------------------

export interface UserRow {
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  last_seen: string;
}

export interface UserAction {
  id: number;
  telegram_id: number;
  action: string;
  timestamp: string;
}

export interface Stats {
  total_users: number;
  active_users: number;
  actions: { action: string; count: number }[];
}

export async function fetchUsers(
  limit: number = 50,
  offset: number = 0,
): Promise<{ users: UserRow[]; total: number }> {
  return request<{ users: UserRow[]; total: number }>(`/users?limit=${limit}&offset=${offset}`);
}

export async function fetchUserActions(
  telegram_id: number,
  limit: number = 50,
): Promise<UserAction[]> {
  return request<UserAction[]>(
    `/users/${telegram_id}/actions?limit=${limit}`,
  );
}

export async function fetchStats(hours?: number): Promise<Stats> {
  const query = hours !== undefined ? `?hours=${hours}` : '';
  return request<Stats>(`/stats${query}`);
}
