const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/auth.routes');
const istruttoriRoutes = require('./routes/istruttori.routes');

// CORS per il frontend dev (localhost:3001) e header/metodi usati
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/istruttori', istruttoriRoutes);

module.exports = app;
