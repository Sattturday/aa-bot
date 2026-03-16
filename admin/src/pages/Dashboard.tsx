import { Link } from 'react-router-dom';

const cards = [
  { title: 'Группы', icon: '\uD83D\uDC65', path: '/groups' },
  { title: 'Сообщения', icon: '\uD83D\uDCAC', path: '/messages' },
  { title: 'Ссылки', icon: '\uD83D\uDD17', path: '/urls' },
  { title: 'Настройки', icon: '\u2699\uFE0F', path: '/settings' },
  { title: 'Админы', icon: '\uD83D\uDEE1\uFE0F', path: '/admins' },
  { title: 'Пользователи', icon: '\uD83D\uDC64', path: '/users' },
];

export default function Dashboard() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Админ-панель</h1>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.path} to={c.path} className="card flex flex-col items-center justify-center py-6 hover:shadow-md transition-shadow">
            <span className="text-3xl mb-2">{c.icon}</span>
            <span className="font-medium">{c.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
