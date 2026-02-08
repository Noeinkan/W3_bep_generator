const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const tidpRoutes = require('./routes/tidp');
const midpRoutes = require('./routes/midp');
const exportRoutes = require('./routes/export');
const validationRoutes = require('./routes/validation');
const responsibilityMatrixRoutes = require('./routes/responsibility-matrix');
const aiRoutes = require('./routes/ai');
const bepStructureRoutes = require('./routes/bep-structure');
const draftsRoutes = require('./routes/drafts');
const documentsRoutes = require('./routes/documents');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://77.42.70.26.nip.io']
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true
}));

// Increased limit for BEP PDF generation with compressed component images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/health', (req, res) => res.send('OK'));

const migrateRoutes = require('./routes/migrate');
app.use('/api/tidp', tidpRoutes);
app.use('/api/midp', midpRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/migrate', migrateRoutes);
app.use('/api/responsibility-matrix', responsibilityMatrixRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/bep-structure', bepStructureRoutes);
app.use('/api/drafts', draftsRoutes);
app.use('/api/documents', documentsRoutes);

// Error handling middleware
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

// 404 handler - must be last
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

module.exports = app;
