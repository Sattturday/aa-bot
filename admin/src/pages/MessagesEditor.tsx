import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMessages, updateMessage } from '../api/client';
import type { MessageRow } from '../api/client';

// Сообщения, которые имеет смысл редактировать, с понятными подписями
const MESSAGE_LABELS: Record<string, string> = {
  start: 'Приветственное сообщение (/start)',
  group_schedule: 'Заголовок расписания групп',
  newbie: 'Текст для новичков',
  participant: 'Текст для членов АА',
  relative: 'Текст для родственников',
  about_aa: 'О программе АА',
  want_to_quit: 'Хочу бросить пить',
  what_to_expect: 'Что ждать от собрания',
  service: 'Хочу взять служение',
  alanon: 'Ал-Анон',
  open_meeting: 'Открытое собрание',
  steps: '12 шагов',
  step_11_am: '11 шаг (утро)',
  step_11_pm: '11 шаг (вечер)',
};

export default function MessagesEditor() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

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

  const filtered = showAll
    ? messages
    : messages.filter((m) => m.key in MESSAGE_LABELS);

  if (loading) return <div className="state-loading">Загрузка...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/" className="back-link">&#8592; Назад</Link>
        <span className="page-header-title">Сообщения</span>
        <div className="page-header-side" />
      </div>

      {error && <div className="banner-error">{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((msg) => (
          <div key={msg.key} className="form-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--tg-theme-text-color)' }}>
                {MESSAGE_LABELS[msg.key] || msg.key}
              </span>
              {successKey === msg.key && (
                <span className="banner-success">Сохранено</span>
              )}
            </div>
            <textarea
              value={msg.value}
              onChange={(e) => handleChange(msg.key, e.target.value)}
              className="input"
              rows={4}
              style={{ marginBottom: 10 }}
            />
            <button
              onClick={() => handleSave(msg)}
              disabled={savingKey === msg.key}
              className="btn btn-primary"
              style={{ fontSize: 13, padding: '7px 14px' }}
            >
              {savingKey === msg.key ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="state-empty">Нет сообщений</div>
        )}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className="btn btn-secondary"
        style={{ marginTop: 12, width: '100%' }}
      >
        {showAll ? 'Скрыть остальные' : `Показать все (${messages.length})`}
      </button>
    </div>
  );
}
