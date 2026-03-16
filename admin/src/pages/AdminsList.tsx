import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdmins, addAdmin, removeAdmin } from '../api/client';
import type { AdminRow } from '../api/client';

export default function AdminsList() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formTgId, setFormTgId] = useState('');
  const [formName, setFormName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    try {
      setLoading(true);
      const data = await fetchAdmins();
      setAdmins(data);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!formTgId.trim()) return;
    try {
      setSaving(true);
      setError('');
      const newAdmin = await addAdmin(Number(formTgId.trim()), formName.trim());
      setAdmins((prev) => [...prev, newAdmin]);
      setFormTgId('');
      setFormName('');
      setShowForm(false);
    } catch (e: any) {
      setError(e.message || 'Ошибка добавления');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(telegramId: number) {
    if (!confirm('Удалить админа?')) return;
    try {
      await removeAdmin(telegramId);
      setAdmins((prev) => prev.filter((a) => a.telegram_id !== telegramId));
    } catch (e: any) {
      setError(e.message || 'Ошибка удаления');
    }
  }

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="text-blue-500 hover:underline">&larr; Назад</Link>
        <h1 className="text-xl font-bold">Админы</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          Добавить
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {showForm && (
        <div className="card mb-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Telegram ID</label>
            <input
              value={formTgId}
              onChange={(e) => setFormTgId(e.target.value)}
              className="input"
              placeholder="123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Имя</label>
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="input"
              placeholder="Имя админа"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={saving} className="btn btn-primary">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn btn-secondary">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {admins.map((admin) => (
          <div key={admin.telegram_id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{admin.name || 'Без имени'}</div>
              <div className="text-sm text-gray-500">ID: {admin.telegram_id}</div>
            </div>
            <button
              onClick={() => handleDelete(admin.telegram_id)}
              className="btn btn-danger ml-2"
            >
              Удалить
            </button>
          </div>
        ))}
        {admins.length === 0 && (
          <div className="text-gray-500 text-center py-8">Нет админов</div>
        )}
      </div>
    </div>
  );
}
