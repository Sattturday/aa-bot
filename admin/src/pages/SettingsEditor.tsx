import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSettings, updateSetting } from '../api/client';
import type { SettingRow } from '../api/client';

export default function SettingsEditor() {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await fetchSettings();
      setSettings(data);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(key: string, value: string) {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }

  async function handleSave(entry: SettingRow) {
    try {
      setSavingKey(entry.key);
      setError('');
      await updateSetting(entry.key, entry.value);
      setSuccessKey(entry.key);
      setTimeout(() => setSuccessKey(null), 2000);
    } catch (e: any) {
      setError(e.message || 'Ошибка сохранения');
    } finally {
      setSavingKey(null);
    }
  }

  if (loading) return <div className="state-loading">Загрузка...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-link">&#8592; Назад</Link>
        <span className="page-header-title">Настройки</span>
        <div className="page-header-side" />
      </div>

      {error && <div className="banner-error">{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {settings.map((entry) => (
          <div key={entry.key} className="form-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="key-label">{entry.key}</span>
              {successKey === entry.key && (
                <span className="banner-success">Сохранено</span>
              )}
            </div>
            <input
              type="text"
              value={entry.value}
              onChange={(e) => handleChange(entry.key, e.target.value)}
              className="input"
              style={{ marginBottom: 10 }}
            />
            <button
              onClick={() => handleSave(entry)}
              disabled={savingKey === entry.key}
              className="btn btn-primary"
              style={{ fontSize: 13, padding: '7px 14px' }}
            >
              {savingKey === entry.key ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        ))}
        {settings.length === 0 && (
          <div className="state-empty">Нет настроек</div>
        )}
      </div>
    </div>
  );
}
