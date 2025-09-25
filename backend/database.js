const sqlite3 = require('sqlite3').verbose(); // SQLite driver
const db = new sqlite3.Database('./palestra.db'); // DB file locale
const bcrypt = require('bcrypt'); // Per hash password

db.serialize(() => {
  // Abilita foreign keys
  db.run(`PRAGMA foreign_keys = ON`);

  // Table istruttori
  db.run(`CREATE TABLE IF NOT EXISTS istruttori (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL CHECK(length(nome) > 1),
    cognome TEXT NOT NULL CHECK(length(cognome) > 1),
    email TEXT UNIQUE NOT NULL,
    specializzazione TEXT,
    telefono TEXT
  )`);

  // Table clienti
  db.run(`CREATE TABLE IF NOT EXISTS clienti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL CHECK(length(nome) > 1),
    cognome TEXT NOT NULL CHECK(length(cognome) > 1),
    email TEXT UNIQUE NOT NULL,
    telefono TEXT,
    data_nascita TEXT,
    indirizzo TEXT
  )`);

  // Table abbonamenti
  db.run(`CREATE TABLE IF NOT EXISTS abbonamenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_abbonamento TEXT NOT NULL UNIQUE,
    durata_mesi INTEGER NOT NULL CHECK(durata_mesi > 0),
    prezzo REAL NOT NULL CHECK(prezzo >= 0),
    descrizione TEXT
  )`);

  // Table iscrizioni (collegamento clienti-abbonamenti)
  db.run(`CREATE TABLE IF NOT EXISTS iscrizioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    abbonamento_id INTEGER NOT NULL,
    data_inizio TEXT NOT NULL,
    data_fine TEXT NOT NULL,
    FOREIGN KEY(cliente_id) REFERENCES clienti(id) ON DELETE CASCADE,
    FOREIGN KEY(abbonamento_id) REFERENCES abbonamenti(id) ON DELETE CASCADE,
    CHECK(date(data_fine) > date(data_inizio))
  )`);

  // Table corsi
  db.run(`CREATE TABLE IF NOT EXISTS corsi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_corso TEXT NOT NULL UNIQUE,
    descrizione TEXT,
    durata_minuti INTEGER NOT NULL CHECK(durata_minuti > 0),
    massimo_partecipanti INTEGER NOT NULL CHECK(massimo_partecipanti > 0)
  )`);

  // Table sale
  db.run(`CREATE TABLE IF NOT EXISTS sale (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_sala TEXT NOT NULL UNIQUE,
    capienza INTEGER NOT NULL CHECK(capienza > 0),
    descrizione TEXT
  )`);

  // Table lezioni (programmazione corsi)
  db.run(`CREATE TABLE IF NOT EXISTS lezioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    corso_id INTEGER NOT NULL,
    sala_id INTEGER NOT NULL,
    istruttore_id INTEGER NOT NULL,
    data_ora_inizio TEXT NOT NULL,
    durata INTEGER NOT NULL CHECK(durata > 0),
    FOREIGN KEY(corso_id) REFERENCES corsi(id) ON DELETE CASCADE,
    FOREIGN KEY(sala_id) REFERENCES sale(id) ON DELETE CASCADE,
    FOREIGN KEY(istruttore_id) REFERENCES istruttori(id) ON DELETE CASCADE
  )`);

  // Table prenotazioni
  db.run(`CREATE TABLE IF NOT EXISTS prenotazioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lezione_id INTEGER NOT NULL,
    cliente_id INTEGER NOT NULL,
    stato TEXT NOT NULL CHECK(stato IN ('confermato', 'annullato')),
    FOREIGN KEY(lezione_id) REFERENCES lezioni(id) ON DELETE CASCADE,
    FOREIGN KEY(cliente_id) REFERENCES clienti(id) ON DELETE CASCADE,
    UNIQUE(lezione_id, cliente_id)
  )`);

  // Table presenze
  db.run(`CREATE TABLE IF NOT EXISTS presenze (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    lezione_id INTEGER NOT NULL,
    data_accesso TEXT NOT NULL,
    stato TEXT NOT NULL CHECK(stato IN ('presente', 'assente')),
    FOREIGN KEY(cliente_id) REFERENCES clienti(id) ON DELETE CASCADE,
    FOREIGN KEY(lezione_id) REFERENCES lezioni(id) ON DELETE CASCADE
  )`);

  // Table pagamenti
  db.run(`CREATE TABLE IF NOT EXISTS pagamenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    abbonamento_id INTEGER NOT NULL,
    data_pagamento TEXT NOT NULL,
    importo REAL NOT NULL CHECK(importo >= 0),
    FOREIGN KEY(cliente_id) REFERENCES clienti(id) ON DELETE CASCADE,
    FOREIGN KEY(abbonamento_id) REFERENCES abbonamenti(id) ON DELETE CASCADE
  )`);

  // Table comunicazioni
  db.run(`CREATE TABLE IF NOT EXISTS comunicazioni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titolo TEXT NOT NULL,
    messaggio TEXT NOT NULL,
    data_pubblicazione TEXT NOT NULL,
    destinatari TEXT NOT NULL CHECK(destinatari IN ('tutti', 'istruttori', 'clienti'))
  )`);

  // NUOVA tabella utenti_app per login e ruoli
  db.run(`CREATE TABLE IF NOT EXISTS utenti_app (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    ruolo TEXT NOT NULL CHECK(ruolo IN ('admin','istruttore','reception','cliente')),
    cliente_id INTEGER,
    istruttore_id INTEGER,
    attivo INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY(cliente_id) REFERENCES clienti(id) ON DELETE SET NULL,
    FOREIGN KEY(istruttore_id) REFERENCES istruttori(id) ON DELETE SET NULL
  )`);

  // Trigger: impedisce overbooking lezioni
  db.run(`
    CREATE TRIGGER IF NOT EXISTS check_max_prenotazioni
    BEFORE INSERT ON prenotazioni
    FOR EACH ROW
    BEGIN
      SELECT 
        CASE 
          WHEN (SELECT COUNT(*) FROM prenotazioni 
                WHERE lezione_id = NEW.lezione_id AND stato = 'confermato') >= 
               (SELECT massimo_partecipanti 
                FROM lezioni JOIN corsi ON lezioni.corso_id = corsi.id 
                WHERE lezioni.id = NEW.lezione_id) 
          THEN RAISE (ABORT, 'Lezione piena, non è possibile confermare la prenotazione.')
        END;
    END;
  `);

  // Seed admin se non esiste (email: admin@palestra.test, password: Admin1234!)
  const seedAdmin = async () => {
    const email = 'admin@palestra.test';
    const password = 'Admin1234!'; // Solo per sviluppo
    const role = 'admin';
    db.get('SELECT id FROM utenti_app WHERE email = ?', [email], async (err, row) => {
      if (err) return console.error('Errore seed admin:', err.message);
      if (!row) {
        try {
          const hash = await bcrypt.hash(password, 10); // saltRounds raccomandati 10-12
          db.run(
            `INSERT INTO utenti_app (email, password_hash, ruolo, attivo) VALUES (?, ?, ?, 1)`,
            [email, hash, role],
            function (err2) {
              if (err2) return console.error('Errore inserimento admin:', err2.message);
              console.log('Creato utente admin di test:', email, 'password:', password);
            }
          );
        } catch (e) {
          console.error('Errore durante hash password admin:', e.message);
        }
      }
    });
  };
  // Avvia seed admin
  seedAdmin();
});

module.exports = db;
