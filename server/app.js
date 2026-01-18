const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const tidpRoutes = require('./routes/tidp');
const midpRoutes = require('./routes/midp');
const exportRoutes = require('./routes/export');
const validationRoutes = require('./routes/validation');
const responsibilityMatrixRoutes = require('./routes/responsibility-matrix');
const aiRoutes = require('./routes/ai');

const app = express();

// CORS config (match server.js behavior)
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => res.send('OK'));

app.get('/tidp-midp-manager', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tidp-midp-manager.html'));
});

const migrateRoutes = require('./routes/migrate');
app.use('/api/tidp', tidpRoutes);
app.use('/api/midp', midpRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/migrate', migrateRoutes);
app.use('/api/responsibility-matrix', responsibilityMatrixRoutes);
app.use('/api/ai', aiRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details.map(detail => detail.message)
    });
  }
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
