import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers, fetchUserActions, fetchStats } from '../api/client';
import type { UserRow, UserAction, Stats } from '../api/client';

const PAGE_SIZE = 20;

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

  useEffect(() => {
    loadData();
  }, [offset]);

  async function loadData() {
    try {
      setLoading(true);
      const [usersRes, statsData] = await Promise.all([
        fetchUsers(PAGE_SIZE, offset),
        offset === 0 ? fetchStats() : Promise.resolve(null),
      ]);
      setUsers(usersRes.users);
      setTotal(usersRes.total);
      if (statsData) setStats(statsData);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

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

  if (loading && offset === 0) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="text-blue-500 hover:underline">&larr; Назад</Link>
        <h1 className="text-xl font-bold">Пользователи</h1>
        <div />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="card text-center">
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <div className="text-sm text-gray-500">Всего</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold">{stats.active_users}</div>
            <div className="text-sm text-gray-500">Активных</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold">{stats.actions.length}</div>
            <div className="text-sm text-gray-500">Типов действий</div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 text-sm font-medium text-gray-500">Имя</th>
              <th className="py-2 px-3 text-sm font-medium text-gray-500">Фамилия</th>
              <th className="py-2 px-3 text-sm font-medium text-gray-500">Username</th>
              <th className="py-2 px-3 text-sm font-medium text-gray-500">Последний визит</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <>
                <tr
                  key={user.telegram_id}
                  onClick={() => toggleUser(user)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-2 px-3">{user.first_name || '-'}</td>
                  <td className="py-2 px-3">{user.last_name || '-'}</td>
                  <td className="py-2 px-3">{user.username ? `@${user.username}` : '-'}</td>
                  <td className="py-2 px-3 text-sm text-gray-500">
                    {user.last_seen ? new Date(user.last_seen).toLocaleString('ru-RU') : '-'}
                  </td>
                </tr>
                {expandedUserId === user.telegram_id && (
                  <tr key={`${user.telegram_id}-actions`}>
                    <td colSpan={4} className="py-2 px-3 bg-gray-50">
                      {actionsLoading ? (
                        <div className="text-sm text-gray-500">Загрузка...</div>
                      ) : actions.length > 0 ? (
                        <div className="space-y-1">
                          <div className="text-sm font-medium mb-1">Последние действия:</div>
                          {actions.map((a) => (
                            <div key={a.id} className="text-sm flex justify-between">
                              <span>{a.action}</span>
                              <span className="text-gray-400">
                                {new Date(a.timestamp).toLocaleString('ru-RU')}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Нет действий</div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-gray-500 text-center py-8">Нет пользователей</div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
          disabled={offset === 0}
          className="btn btn-secondary disabled:opacity-50"
        >
          &larr; Назад
        </button>
        <span className="text-sm text-gray-500 self-center">
          {offset + 1} &ndash; {offset + users.length}
        </span>
        <button
          onClick={() => setOffset((o) => o + PAGE_SIZE)}
          disabled={offset + PAGE_SIZE >= total}
          className="btn btn-secondary disabled:opacity-50"
        >
          Вперёд &rarr;
        </button>
      </div>
    </div>
  );
}
