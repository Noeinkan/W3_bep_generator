require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

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
const aiRoutes = require('./routes/ai');
const draftsRoutes = require('./routes/drafts');

// Import services
const puppeteerPdfService = require('./services/puppeteerPdfService');

const app = require('./app');
const PORT = process.env.PORT || 3001;

// Security middleware
// app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : function (origin, callback) {
        // Allow localhost and Cloudflare tunnel URLs
        const allowedOrigins = [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3001'
        ];

        // Allow any trycloudflare.com domain for tunneling
        if (!origin || allowedOrigins.includes(origin) || /\.trycloudflare\.com$/.test(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
  credentials: true
}));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory
// app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested at', new Date().toISOString(), 'from', req.ip, req.connection.remoteAddress);
  res.set('Content-Type', 'text/plain');
  res.send('OK');
});

// Serve TIDP/MIDP Manager UI
app.get('/tidp-midp-manager', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tidp-midp-manager.html'));
});

// API routes
const migrateRoutes = require('./routes/migrate');
app.use('/api/tidp', tidpRoutes);
app.use('/api/midp', midpRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/migrate', migrateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/drafts', draftsRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);

    // Initialize Puppeteer browser pool
    try {
      console.log('🚀 Initializing Puppeteer...');
      await puppeteerPdfService.initialize();
      console.log('✅ Puppeteer initialized successfully');
    } catch (error) {
      console.error('⚠️  Puppeteer initialization failed:', error.message);
      console.error('   PDF generation will not be available until server restart');
    }
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await puppeteerPdfService.cleanup();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await puppeteerPdfService.cleanup();
  process.exit(0);
});