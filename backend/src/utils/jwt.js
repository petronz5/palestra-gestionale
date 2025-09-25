const jwt = require('jsonwebtoken');

const signToken = (payload, expiresIn = process.env.JWT_EXPIRES || '1h') => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET non definita');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { signToken, verifyToken };
