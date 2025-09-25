const express = require('express');
const router = express.Router();
const istruttori = require('../controllers/istruttori.controller');
const requireAuth = require('../middleware/auth'); // importa

router.get('/', requireAuth, istruttori.list);   // protetta
router.post('/', requireAuth, istruttori.create); // protetta (poi si può fare controllo ruolo)

module.exports = router;
