import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMessages, updateMessage } from '../api/client';
import type { MessageRow } from '../api/client';

export default function MessagesEditor() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      setLoading(true);
      const data = await fetchMessages();
      setMessages(data);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(key: string, value: string) {
    setMessages((prev) =>
      prev.map((m) => (m.key === key ? { ...m, value } : m))
    );
  }

  async function handleSave(msg: MessageRow) {
    try {
      setSavingKey(msg.key);
      setError('');
      await updateMessage(msg.key, msg.value);
      setSuccessKey(msg.key);
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
        <h1 className="text-xl font-bold">Сообщения</h1>
        <div />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.key} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-gray-500">{msg.key}</span>
              {successKey === msg.key && (
                <span className="text-green-500 text-sm">Сохранено</span>
              )}
            </div>
            <textarea
              value={msg.value}
              onChange={(e) => handleChange(msg.key, e.target.value)}
              className="input mb-2"
              rows={4}
            />
            <button
              onClick={() => handleSave(msg)}
              disabled={savingKey === msg.key}
              className="btn btn-primary"
            >
              {savingKey === msg.key ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-gray-500 text-center py-8">Нет сообщений</div>
        )}
      </div>
    </div>
  );
}
