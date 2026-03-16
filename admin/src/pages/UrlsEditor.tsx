import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUrls, updateUrl } from '../api/client';
import type { UrlRow } from '../api/client';

export default function UrlsEditor() {
  const [urls, setUrls] = useState<UrlRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  useEffect(() => {
    loadUrls();
  }, []);

  async function loadUrls() {
    try {
      setLoading(true);
      const data = await fetchUrls();
      setUrls(data);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(key: string, value: string) {
    setUrls((prev) => prev.map((u) => (u.key === key ? { ...u, value } : u)));
  }

  async function handleSave(entry: UrlRow) {
    try {
      setSavingKey(entry.key);
      setError('');
      await updateUrl(entry.key, entry.value);
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
        <h1 className="text-xl font-bold">Ссылки</h1>
        <div />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        {urls.map((entry) => (
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
        {urls.length === 0 && (
          <div className="text-gray-500 text-center py-8">Нет ссылок</div>
        )}
      </div>
    </div>
  );
}
