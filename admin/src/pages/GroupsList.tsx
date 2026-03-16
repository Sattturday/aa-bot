import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchGroups, deleteGroup } from '../api/client';
import type { GroupWithSchedules } from '../api/client';

const TABS = [
  { label: 'Все', value: 'all' },
  { label: 'АА', value: 'aa' },
  { label: 'Ал-Анон', value: 'alanon' },
];

export default function GroupsList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<GroupWithSchedules[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    try {
      setLoading(true);
      const data = await fetchGroups();
      setGroups(data);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить группу?')) return;
    try {
      await deleteGroup(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (e: any) {
      setError(e.message || 'Ошибка удаления');
    }
  }

  const filtered = tab === 'all' ? groups : groups.filter((g) => g.type === tab);

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="text-blue-500 hover:underline">&larr; Назад</Link>
        <h1 className="text-xl font-bold">Группы</h1>
        <Link to="/groups/new" className="btn btn-primary">Добавить группу</Link>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`btn ${tab === t.value ? 'btn-primary' : 'btn-secondary'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((g) => (
          <div key={g.id} className="card flex items-center justify-between">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => navigate(`/groups/${g.id}/edit`)}
            >
              <div className="font-medium">{g.name}</div>
              <div className="text-sm text-gray-500">
                {g.city}
                {g.schedules && g.schedules.length > 0 && (
                  <> &middot; {g.schedules.map((s) => `${s.days} ${s.time}`).join(', ')}</>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(g.id)}
              className="btn btn-danger ml-2"
            >
              Удалить
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-gray-500 text-center py-8">Нет групп</div>
        )}
      </div>
    </div>
  );
}
