// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { getRole } from '../utils/Auth';
import { useState } from 'react';

const baseItems = [
  { to: '/dashboard', label: 'Home', roles: ['cliente','reception','istruttore'] },
];

const clienteItems = [
  { to: '/abbonamento', label: 'Il mio abbonamento', roles: ['cliente'] },
  { to: '/corsi', label: 'Corsi disponibili', roles: ['cliente'] },
  { to: '/prenotazioni', label: 'Le mie prenotazioni', roles: ['cliente'] },
];

const receptionItems = [
  { to: '/clienti', label: 'Clienti', roles: ['reception'] },
  { to: '/iscrizioni', label: 'Iscrizioni', roles: ['reception'] },
  { to: '/pagamenti', label: 'Pagamenti', roles: ['reception'] },
];

const istruttoreItems = [
  { to: '/lezioni', label: 'Le mie lezioni', roles: ['istruttore'] },
  { to: '/presenze', label: 'Presenze', roles: ['istruttore'] },
];

export default function Sidebar() {
  const ruolo = getRole();
  const [open, setOpen] = useState(false);

  const items = [
    ...baseItems,
    ...clienteItems,
    ...receptionItems,
    ...istruttoreItems,
  ].filter(i => i.roles.includes(ruolo));

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold">Palestra</span>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
        >
          Menu
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-16 hidden lg:flex items-center px-4 border-b border-slate-200">
          <span className="text-lg font-semibold">Palestra</span>
        </div>
        <nav className="p-4 space-y-1">
          {items.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition
                 ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
