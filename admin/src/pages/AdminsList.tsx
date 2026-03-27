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
  const [confirmId, setConfirmId] = useState<number | null>(null);

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
    if (confirmId !== telegramId) {
      setConfirmId(telegramId);
      setTimeout(() => setConfirmId((prev) => (prev === telegramId ? null : prev)), 3000);
      return;
    }
    setConfirmId(null);
    try {
      await removeAdmin(telegramId);
      setAdmins((prev) => prev.filter((a) => a.telegram_id !== telegramId));
    } catch (e: any) {
      setError(e.message || 'Ошибка удаления');
    }
  }

  if (loading) return <div className="state-loading">Загрузка...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-link">&#8592; Назад</Link>
        <span className="page-header-title">Админы</span>
        <div className="page-header-side">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary btn-primary-sm"
          >
            {showForm ? 'Отмена' : '+ Добавить'}
          </button>
        </div>
      </div>

      {error && <div className="banner-error">{error}</div>}

      {showForm && (
        <div className="form-card" style={{ marginBottom: 12 }}>
          <div className="text-hint" style={{ marginBottom: 12 }}>
            Введите Telegram ID нового админа. Узнать ID можно через бот @userinfobot. После добавления админ увидит кнопку «Админ-панель» в боте и сможет войти без пароля.
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Telegram ID</label>
            <input
              value={formTgId}
              onChange={(e) => setFormTgId(e.target.value)}
              className="input"
              placeholder="123456789"
              inputMode="numeric"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Имя</label>
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="input"
              placeholder="Имя админа"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="btn btn-primary btn-full"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {admins.map((admin) => (
          <div key={admin.telegram_id} className="list-item" style={{ gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 15, color: 'var(--tg-theme-text-color)' }}>
                {admin.name || 'Без имени'}
              </div>
              <div className="text-hint">ID: {admin.telegram_id}</div>
            </div>
            <button
              onClick={() => handleDelete(admin.telegram_id)}
              className="btn btn-danger"
              style={{ flexShrink: 0 }}
            >
              {confirmId === admin.telegram_id ? 'Точно?' : 'Удалить'}
            </button>
          </div>
        ))}
        {admins.length === 0 && (
          <div className="state-empty">Нет админов</div>
        )}
      </div>
    </div>
  );
}
