// src/pages/Dashboard.jsx
import AppShell from '../components/AppShell';
import { getRole } from '../utils/Auth';
import { useEffect, useState } from 'react';
import { getToken } from '../utils/Auth';

export default function Dashboard() {
  const ruolo = getRole();
  const [istruttori, setIstruttori] = useState([]);

  useEffect(() => {
    // Esempio: carica istruttori solo per reception/istruttore
    const canSeeIstruttori = ['reception', 'istruttore'].includes(ruolo);
    if (!canSeeIstruttori) return;

    const fetchIstruttori = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/istruttori', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (res.ok) setIstruttori(data.istruttori || []);
      } catch {}
    };
    fetchIstruttori();
  }, [ruolo]);

  return (
    <AppShell title="Dashboard">
      {/* Cards riepilogo */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ruolo === 'cliente' && (
          <>
            <Card title="Abbonamento attivo" value="Mensile · scade tra 18 giorni" />
            <Card title="Prossima lezione" value="Yoga · Domani 18:00" />
            <Card title="Prenotazioni" value="2 confermate" />
          </>
        )}

        {ruolo === 'reception' && (
          <>
            <Card title="Clienti attivi" value="248" />
            <Card title="Scadenze mese" value="37" />
            <Card title="Pagamenti oggi" value="€ 1.240" />
          </>
        )}

        {ruolo === 'istruttore' && (
          <>
            <Card title="Lezioni oggi" value="3" />
            <Card title="Iscritti prossima lezione" value="12/20" />
            <Card title="Presenze mese" value="86" />
          </>
        )}
      </section>

      {/* Sezioni per ruolo */}
      <section className="mt-8 space-y-8">
        {ruolo === 'cliente' && (
          <>
            <Panel title="I miei corsi">
              <p className="text-sm text-slate-600">Elenco corsi disponibili e prenotazioni rapide.</p>
            </Panel>
            <Panel title="Abbonamento">
              <p className="text-sm text-slate-600">Dettaglio abbonamento, rinnovo e storico pagamenti.</p>
            </Panel>
          </>
        )}

        {ruolo === 'reception' && (
          <>
            <Panel title="Istruttori">
              <ul className="text-sm text-slate-700 list-disc pl-5">
                {istruttori.map((it) => (
                  <li key={it.id}>{it.nome} {it.cognome} · {it.email}</li>
                ))}
              </ul>
            </Panel>
            <Panel title="Gestione clienti">
              <p className="text-sm text-slate-600">Crea/aggiorna clienti, iscrizioni e pagamenti.</p>
            </Panel>
          </>
        )}

        {ruolo === 'istruttore' && (
          <>
            <Panel title="Le mie lezioni">
              <p className="text-sm text-slate-600">Calendario lezioni, iscritti e registrazione presenze.</p>
            </Panel>
            <Panel title="Comunicazioni">
              <p className="text-sm text-slate-600">Avvisi ai partecipanti e aggiornamenti orari.</p>
            </Panel>
          </>
        )}
      </section>
    </AppShell>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <p className="text-sm text-slate-600">{title}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
