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

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="text-blue-500 hover:underline">&larr; Назад</Link>
        <h1 className="text-xl font-bold">Настройки</h1>
        <div />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        {settings.map((entry) => (
          <div key={entry.key} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-gray-500">{entry.key}</span>
              {successKey === entry.key && (
                <span className="text-green-500 text-sm">Сохранено</span>
              )}
            </div>
            <input
              type="text"
              value={entry.value}
              onChange={(e) => handleChange(entry.key, e.target.value)}
              className="input mb-2"
            />
            <button
              onClick={() => handleSave(entry)}
              disabled={savingKey === entry.key}
              className="btn btn-primary"
            >
              {savingKey === entry.key ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        ))}
        {settings.length === 0 && (
          <div className="text-gray-500 text-center py-8">Нет настроек</div>
        )}
      </div>
    </div>
  );
}
