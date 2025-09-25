// backend/src/controllers/auth.controller.js
const db = require('../../database');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email e password sono obbligatorie' });

  db.get('SELECT * FROM utenti_app WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || !user.attivo) return res.status(401).json({ error: 'Credenziali non valide' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenziali non valide' });

    const token = signToken({ id: user.id, ruolo: user.ruolo });
    res.json({
      token,
      user: { id: user.id, email: user.email, ruolo: user.ruolo }
    });
  });
};

// NUOVO: registrazione
exports.register = async (req, res) => {
  const { email, password, ruolo = 'cliente', cliente_id = null, istruttore_id = null } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password sono obbligatorie' });
  }
  // Ruoli consentiti
  const allowed = ['admin', 'istruttore', 'reception', 'cliente'];
  if (!allowed.includes(ruolo)) {
    return res.status(400).json({ error: 'Ruolo non valido' });
  }

  db.get('SELECT id FROM utenti_app WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(409).json({ error: 'Utente già registrato' });

    try {
      const hash = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO utenti_app (email, password_hash, ruolo, cliente_id, istruttore_id, attivo)
                   VALUES (?, ?, ?, ?, ?, 1)`;
      db.run(sql, [email, hash, ruolo, cliente_id, istruttore_id], function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        // opzionale: login automatico post‑register
        const token = signToken({ id: this.lastID, ruolo });
        res.status(201).json({
          message: 'Registrazione completata',
          token,
          user: { id: this.lastID, email, ruolo }
        });
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
};

// NUOVO: profilo utente corrente
exports.me = (req, res) => {
  // req.user arriva dal middleware JWT
  res.json({ user: req.user });
};
