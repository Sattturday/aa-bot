import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers, fetchUserActions, fetchStats } from '../api/client';
import type { UserRow, UserAction, Stats } from '../api/client';

const PAGE_SIZE = 20;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [actions, setActions] = useState<UserAction[]>([]);
  const [actionsLoading, setActionsLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, statsData] = await Promise.all([
        fetchUsers(PAGE_SIZE, offset),
        offset === 0 ? fetchStats() : Promise.resolve(null),
      ]);
      setUsers(usersRes.users);
      setTotal(usersRes.total);
      if (statsData) setStats(statsData);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Ошибка загрузки'));
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function toggleUser(user: UserRow) {
    if (expandedUserId === user.telegram_id) {
      setExpandedUserId(null);
      setActions([]);
      return;
    }
    setExpandedUserId(user.telegram_id);
    try {
      setActionsLoading(true);
      const data = await fetchUserActions(user.telegram_id);
      setActions(data);
    } catch {
      setActions([]);
    } finally {
      setActionsLoading(false);
    }
  }

  if (loading && offset === 0) return <div className="state-loading">Загрузка...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-link">&#8592; Назад</Link>
        <span className="page-header-title">Пользователи</span>
        <div className="page-header-side" />
      </div>

      {error && <div className="banner-error">{error}</div>}

      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div className="stat-card">
            <div className="stat-value">{stats.total_users}</div>
            <div className="stat-label">Всего</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.active_users}</div>
            <div className="stat-label">Активных</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.actions.length}</div>
            <div className="stat-label">Действий</div>
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table className="tg-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Username</th>
              <th>Посл. визит</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user.telegram_id}>
                <tr
                  onClick={() => toggleUser(user)}
                  style={{ cursor: 'pointer' }}
                  className={expandedUserId === user.telegram_id ? 'row-expanded' : ''}
                >
                  <td>{user.first_name || '—'}</td>
                  <td>{user.last_name || '—'}</td>
                  <td>{user.username ? `@${user.username}` : '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--tg-theme-hint-color)', whiteSpace: 'nowrap' }}>
                    {user.last_seen ? new Date(user.last_seen).toLocaleString('ru-RU') : '—'}
                  </td>
                </tr>
                {expandedUserId === user.telegram_id && (
                  <tr className="row-expanded">
                    <td colSpan={4} style={{ padding: '10px 12px' }}>
                      {actionsLoading ? (
                        <div className="text-hint">Загрузка...</div>
                      ) : actions.length > 0 ? (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tg-theme-hint-color)', marginBottom: 6 }}>
                            Последние действия:
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {actions.map((a) => (
                              <div
                                key={a.id}
                                style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}
                              >
                                <span style={{ color: 'var(--tg-theme-text-color)' }}>{a.action}</span>
                                <span className="text-hint">
                                  {new Date(a.created_at).toLocaleString('ru-RU')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-hint">Нет действий</div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="state-empty">Нет пользователей</div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          gap: 8,
        }}
      >
        <button
          onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
          disabled={offset === 0}
          className="btn btn-secondary"
        >
          &#8592; Назад
        </button>
        <span className="text-hint" style={{ fontSize: 13 }}>
          {offset + 1}–{offset + users.length} из {total}
        </span>
        <button
          onClick={() => setOffset((o) => o + PAGE_SIZE)}
          disabled={offset + PAGE_SIZE >= total}
          className="btn btn-secondary"
        >
          Вперёд &#8594;
        </button>
      </div>
    </div>
  );
}
