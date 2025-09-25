// src/components/AppShell.jsx
import Sidebar from './Sidebar';
import { clearToken, clearUser, getUser } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

export default function AppShell({ title = 'Dashboard', children }) {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearToken();
    clearUser();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h1>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-slate-600">
                {user?.email} · {user?.ruolo}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
