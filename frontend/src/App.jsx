// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

// Segnaposto semplici per le pagine della sidebar
function Placeholder({ title }) {
  return <div className="p-4 text-slate-700">{title}</div>;
}

export default function App() {
  return (
    <Routes>
      {/* Pubbliche */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protette: tutte dietro PrivateRoute */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/abbonamento" element={<Placeholder title="Abbonamento" />} />
        <Route path="/corsi" element={<Placeholder title="Corsi disponibili" />} />
        <Route path="/prenotazioni" element={<Placeholder title="Le mie prenotazioni" />} />
        <Route path="/clienti" element={<Placeholder title="Clienti" />} />
        <Route path="/iscrizioni" element={<Placeholder title="Iscrizioni" />} />
        <Route path="/pagamenti" element={<Placeholder title="Pagamenti" />} />
        <Route path="/lezioni" element={<Placeholder title="Le mie lezioni" />} />
        <Route path="/presenze" element={<Placeholder title="Presenze" />} />
      </Route>

      {/* Default */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
