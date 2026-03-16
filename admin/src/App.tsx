import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { validateAuth, setToken, getToken } from './api/client';
import Dashboard from './pages/Dashboard';
import GroupsList from './pages/GroupsList';
import GroupEditor from './pages/GroupEditor';
import MessagesEditor from './pages/MessagesEditor';
import UrlsEditor from './pages/UrlsEditor';
import SettingsEditor from './pages/SettingsEditor';
import AdminsList from './pages/AdminsList';
import UsersPage from './pages/UsersPage';

function App() {
  const { webApp, initData } = useTelegram();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
    }
  }, [webApp]);

  useEffect(() => {
    async function auth() {
      // If already have a token, skip auth
      if (getToken()) {
        setAuthed(true);
        setLoading(false);
        return;
      }

      // Dev mode: accept token from URL param ?token=...
      const urlToken = new URLSearchParams(window.location.search).get('token');
      if (urlToken) {
        setToken(urlToken);
        setAuthed(true);
        setLoading(false);
        return;
      }

      if (!initData) {
        setError('Откройте через Telegram Mini App');
        setLoading(false);
        return;
      }

      try {
        const { token } = await validateAuth(initData);
        setToken(token);
        setAuthed(true);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Ошибка авторизации');
      } finally {
        setLoading(false);
      }
    }
    auth();
  }, [initData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">{error}</p>
          <p className="text-gray-400 text-sm">Убедитесь, что вы открыли приложение через бот</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return null;
  }

  return (
    <BrowserRouter>
      <div className="max-w-2xl mx-auto px-4 py-4 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/groups" element={<GroupsList />} />
          <Route path="/groups/new" element={<GroupEditor />} />
          <Route path="/groups/:id/edit" element={<GroupEditor />} />
          <Route path="/messages" element={<MessagesEditor />} />
          <Route path="/urls" element={<UrlsEditor />} />
          <Route path="/settings" element={<SettingsEditor />} />
          <Route path="/admins" element={<AdminsList />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
