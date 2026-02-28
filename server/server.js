require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const tidpRoutes = require('./routes/tidp');
const midpRoutes = require('./routes/midp');
const exportRoutes = require('./routes/export');
const validationRoutes = require('./routes/validation');
const aiRoutes = require('./routes/ai');
const draftsRoutes = require('./routes/drafts');
const documentsRoutes = require('./routes/documents');
const projectsRoutes = require('./routes/projects');

// Import services
const puppeteerPdfService = require('./services/puppeteerPdfService');

const app = require('./app');
app.set('trust proxy', 1); // Trust Nginx reverse proxy for correct req.ip
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for now due to inline scripts in React
  crossOriginEmbedderPolicy: false // Allow image loading from data URLs
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS || 'https://77.42.70.26.nip.io').split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true
}));

// Rate limiting - general API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 login attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful logins
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Body parsing middleware
// Increased limit for BEP PDF generation with compressed component images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.use('/api/auth', authRoutes);
app.use('/api/tidp', tidpRoutes);
app.use('/api/midp', midpRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/migrate', migrateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/drafts', draftsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/projects', projectsRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const message = (err && typeof err.message === 'string') ? err.message : 'Internal Server Error';
  console.error('Error:', message, err);

  if (err && err.isJoi) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details.map(detail => detail.message)
    });
  }

  const status = (err && err.status) || 500;
  const body = {
    error: message,
    success: false,
    ...(process.env.NODE_ENV === 'development' && err && { stack: err.stack })
  };
  res.status(status).json(body);
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
  (async function start() {
    const { loadBepConfigAsync } = require('./services/loadBepConfig');
    const configResult = await loadBepConfigAsync();
    if (configResult.success) {
      console.log('✓ BEP config loaded successfully');
    } else {
      console.warn('⚠️  BEP config not loaded; GET /template and BEP form structure may fail until restart');
    }

    app.listen(PORT, '0.0.0.0', async () => {
      console.log(`Server running on port ${PORT}`);

      // Validate critical environment variables
    console.log('\n🔐 Security Check:');
    if (!process.env.JWT_SECRET) {
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ FATAL: JWT_SECRET not set in production!');
        process.exit(1);
      } else {
        console.warn('⚠️  WARNING: JWT_SECRET not set (using insecure default for dev)');
      }
    } else {
      console.log('✅ JWT_SECRET configured');
    }

    // Validate email service configuration
    const emailService = require('./services/emailService');
    const emailStatus = emailService.getStatus();
    if (!emailStatus.configured) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️  WARNING: Email service not configured');
        console.warn('   Password reset and email verification will not work');
        console.warn('   Set SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM in .env');
      } else {
        console.log('ℹ️  Email service not configured (optional in dev)');
      }
    } else {
      console.log(`✅ Email service configured (${emailStatus.mode})`);
    }

    // Initialize Puppeteer browser pool
    try {
      console.log('\n🚀 Initializing Puppeteer...');
      await puppeteerPdfService.initialize();
      console.log('✅ Puppeteer initialized successfully');
    } catch (error) {
      console.error('⚠️  Puppeteer initialization failed:', error.message);
      console.error('   PDF generation will not be available until server restart');
    }
    console.log(''); // blank line for readability
    });
  })().catch((err) => {
    console.error('Server startup failed:', err);
    process.exit(1);
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