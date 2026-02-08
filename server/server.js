/**
 * Server Entry Point
 *
 * Handles server startup, Puppeteer initialization, and graceful shutdown.
 * All app configuration (middleware, routes, error handlers) is in app.js.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const path = require('path');
const express = require('express');
const puppeteerPdfService = require('./services/puppeteerPdfService');

// Import configured Express app
const app = require('./app');
const PORT = process.env.PORT || 3001;

// Production-only: Serve static files and SPA fallback
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

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