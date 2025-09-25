// backend/src/middleware/auth.js
const { verifyToken } = require('../utils/jwt');

module.exports = function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const parts = hdr.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token mancante' });
  }
  try {
    const payload = verifyToken(parts[1]);
    // payload: { id, ruolo, iat, exp }
    req.user = { id: payload.id, ruolo: payload.ruolo };
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Token non valido' });
  }
};
