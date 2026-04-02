import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGroups, deleteGroup } from '../api/client';
import type { GroupWithSchedules } from '../api/client';

const TABS = [
  { label: 'Все', value: 'all' },
  { label: 'АА', value: 'aa' },
  { label: 'Ал-Анон', value: 'alanon' },
] as const;

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function GroupsList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<GroupWithSchedules[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'all' | 'aa' | 'alanon'>('all');
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    try {
      setLoading(true);
      const data = await fetchGroups();
      setGroups(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Ошибка загрузки'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (confirmId !== id) {
      setConfirmId(id);
      setTimeout(() => setConfirmId((prev) => (prev === id ? null : prev)), 3000);
      return;
    }
    setConfirmId(null);
    try {
      await deleteGroup(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Ошибка удаления'));
    }
  }

  const filtered = tab === 'all' ? groups : groups.filter((g) => g.type === tab);

  if (loading) return <div className="state-loading">Загрузка...</div>;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <Link to="/" className="back-link">&#8592; Назад</Link>
        <span className="page-header-title">Группы</span>
        <div className="page-header-side">
          <Link to="/groups/new" className="btn btn-primary btn-primary-sm">+ Добавить</Link>
        </div>
      </div>

      {error && <div className="banner-error">{error}</div>}

      {/* Tab bar */}
      <div className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`tab-btn${tab === t.value ? ' active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((g) => (
          <div key={g.id} className="list-item" style={{ gap: 10 }}>
            <div
              style={{ flex: 1, cursor: 'pointer', minWidth: 0 }}
              onClick={() => navigate(`/groups/${g.id}/edit`)}
            >
              <div style={{ fontWeight: 500, fontSize: 15, color: 'var(--tg-theme-text-color)', marginBottom: 2 }}>
                {g.name}
              </div>
              <div className="text-hint" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {g.city}
                {g.schedules && g.schedules.length > 0 && (
                  <> &middot; {g.schedules.map((s) => `${s.days} ${s.time}`).join(', ')}</>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(g.id)}
              className="btn btn-danger"
              style={{ flexShrink: 0 }}
            >
              {confirmId === g.id ? 'Точно?' : 'Удалить'}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="state-empty">Нет групп</div>
        )}
      </div>
    </div>
  );
}
