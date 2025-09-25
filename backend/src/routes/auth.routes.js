// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const requireAuth = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register); // NUOVO
router.get('/me', requireAuth, authController.me); // NUOVO

module.exports = router;
