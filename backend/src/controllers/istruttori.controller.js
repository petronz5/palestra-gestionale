const db = require('../../database');

exports.list = (req, res) => {
  db.all('SELECT * FROM istruttori', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ istruttori: rows });
  });
};

exports.create = (req, res) => {
  const { nome, cognome, email, specializzazione, telefono } = req.body;
  if (!nome || !cognome || !email) {
    return res.status(400).json({ error: 'Nome, cognome e email sono obbligatori' });
  }
  const sql = `INSERT INTO istruttori (nome, cognome, email, specializzazione, telefono)
               VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [nome, cognome, email, specializzazione || '', telefono || ''], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'Istruttore aggiunto con successo' });
  });
};
