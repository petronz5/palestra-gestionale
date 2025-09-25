// src/pages/Register.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ruolo, setRuolo] = useState('cliente');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ruolo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore registrazione');
      setMessage('Registrazione completata, ora effettua il login.');
    } catch (err) {
      setMessage(err.message || 'Errore registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Crea account</h1>
          <p className="mt-1 text-sm text-slate-600">
            Registrati per iniziare
          </p>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Min. 8 caratteri"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Ruolo</label>
              <select
                value={ruolo}
                onChange={(e) => setRuolo(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="cliente">Cliente</option>
                <option value="reception">Reception</option>
                <option value="istruttore">Istruttore</option>
              </select>
            </div>

            {message && (
              <p
                className={`text-sm rounded-md px-3 py-2 border ${
                  message.toLowerCase().includes('errore')
                    ? 'text-red-600 bg-red-50 border-red-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Registrazione…' : 'Crea account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Hai già un account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Accedi
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          Modulo registrazione responsive
        </p>
      </div>
    </div>
  );
}
