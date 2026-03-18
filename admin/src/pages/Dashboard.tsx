import { Link } from 'react-router-dom';

const cards = [
  { title: 'Группы', description: 'Управление группами АА и Ал-Анон', icon: '👥', path: '/groups' },
  { title: 'Сообщения', description: 'Тексты бота для пользователей', icon: '💬', path: '/messages' },
  { title: 'Ссылки', description: 'Внешние ссылки и URL', icon: '🔗', path: '/urls' },
  { title: 'Настройки', description: 'Общие настройки бота', icon: '⚙️', path: '/settings' },
  { title: 'Админы', description: 'Управление администраторами', icon: '🛡️', path: '/admins' },
  { title: 'Пользователи', description: 'Статистика и действия', icon: '👤', path: '/users' },
];

export default function Dashboard() {
  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tg-theme-text-color)', marginBottom: 2 }}>
          Админ-панель
        </div>
        <div className="text-hint">Управление ботом АА</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {cards.map((c) => (
          <Link key={c.path} to={c.path} className="dash-card">
            <span className="dash-card-icon">{c.icon}</span>
            <span className="dash-card-title">{c.title}</span>
            <span className="dash-card-desc">{c.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
