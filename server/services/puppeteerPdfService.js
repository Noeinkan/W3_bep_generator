const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

/**
 * Puppeteer PDF Service
 * Handles PDF generation from HTML using headless Chrome
 */
class PuppeteerPdfService {
  constructor() {
    this.browser = null;
    this.tempDir = path.join(__dirname, '../temp');
    this.isInitialized = false;
  }

  /**
   * Initialize the browser instance
   */
  async initialize() {
    if (this.browser) {
      console.log('⚠️  Browser already initialized');
      return;
    }

    try {
      console.log('🚀 Launching Puppeteer browser...');

      // Ensure temp directory exists
      await this.ensureTempDir();

      // Launch browser with optimized settings for production
      this.browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--no-first-run',
          '--no-zygote',
          '--disable-background-networking',
          '--disable-default-apps'
        ]
      });

      this.isInitialized = true;
      console.log('✅ Puppeteer browser launched successfully');
    } catch (error) {
      console.error('❌ Failed to launch Puppeteer browser:', error);
      throw new Error(`Browser initialization failed: ${error.message}`);
    }
  }

  /**
   * Ensure temp directory exists
   */
  async ensureTempDir() {
    try {
      await fs.access(this.tempDir);
    } catch {
      await fs.mkdir(this.tempDir, { recursive: true });
      console.log(`📁 Created temp directory: ${this.tempDir}`);
    }
  }

  /**
   * Get browser instance, initialize if needed
   */
  async getBrowser() {
    if (!this.browser || !this.browser.isConnected()) {
      await this.initialize();
    }
    return this.browser;
  }

  /**
   * Generate PDF from HTML string
   * @param {string} html - Complete HTML document
   * @param {Object} options - PDF generation options
   * @returns {Promise<string>} - Path to generated PDF file
   */
  async generatePDFFromHTML(html, options = {}) {
    const startTime = Date.now();
    let page = null;

    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();

      // Set timeout (increased for large HTML with embedded images)
      const timeout = options.timeout || 90000; // Default 90s
      await page.setDefaultTimeout(timeout);

      // Set viewport for A4 consistent rendering
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: options.deviceScaleFactor || 1.5 // Reduced from 2 for performance
      });

      console.log('📄 Loading HTML content...');

      // Load HTML content with optimized wait strategy
      // Use 'domcontentloaded' instead of 'networkidle0' for faster loading
      // All images are embedded as data URLs, so no network requests
      await page.setContent(html, {
        waitUntil: 'domcontentloaded',
        timeout: timeout
      });

      // Small delay to ensure all embedded images are rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('🖨️  Generating PDF...');

      // Prepare PDF options
      const pdfOptions = {
        format: options.format || 'A4',
        landscape: options.orientation === 'landscape',
        printBackground: true,
        preferCSSPageSize: false,
        margin: options.margins || {
          top: '25mm',
          right: '20mm',
          bottom: '25mm',
          left: '20mm'
        },
        displayHeaderFooter: false
      };

      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);

      // Save to temp file
      const filename = `BEP_${Date.now()}.pdf`;
      const filepath = path.join(this.tempDir, filename);
      await fs.writeFile(filepath, pdfBuffer);

      const duration = Date.now() - startTime;
      const sizeMB = (pdfBuffer.length / (1024 * 1024)).toFixed(2);

      console.log(`✅ PDF generated successfully in ${duration}ms (${sizeMB}MB)`);
      console.log(`   File: ${filepath}`);

      return filepath;

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ PDF generation failed after ${duration}ms:`, error.message);

      // Categorize errors for user-friendly messages
      if (error.name === 'TimeoutError') {
        throw new Error('PDF generation timed out. Please try again or use standard quality.');
      } else if (error.message.includes('Protocol error')) {
        throw new Error('Browser rendering failed. Please contact support.');
      } else if (error.message.includes('Navigation')) {
        throw new Error('Failed to load content. Please try again.');
      } else {
        throw new Error(`PDF generation failed: ${error.message}`);
      }

    } finally {
      // Always cleanup page
      if (page) {
        try {
          await page.close();
        } catch (e) {
          console.error('⚠️  Error closing page:', e.message);
        }
      }
    }
  }

  /**
   * Generate PDF from URL (for testing)
   * @param {string} url - URL to convert to PDF
   * @param {Object} options - PDF generation options
   * @returns {Promise<string>} - Path to generated PDF file
   */
  async generatePDFFromURL(url, options = {}) {
    const startTime = Date.now();
    let page = null;

    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();

      const timeout = options.timeout || 60000;
      await page.setDefaultTimeout(timeout);

      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: options.deviceScaleFactor || 2
      });

      console.log(`📄 Navigating to ${url}...`);

      await page.goto(url, {
        waitUntil: ['networkidle0', 'load'],
        timeout: timeout
      });

      const pdfOptions = {
        format: options.format || 'A4',
        landscape: options.orientation === 'landscape',
        printBackground: true,
        margin: options.margins || {
          top: '25mm',
          right: '20mm',
          bottom: '25mm',
          left: '20mm'
        }
      };

      const pdfBuffer = await page.pdf(pdfOptions);

      const filename = `BEP_${Date.now()}.pdf`;
      const filepath = path.join(this.tempDir, filename);
      await fs.writeFile(filepath, pdfBuffer);

      const duration = Date.now() - startTime;
      console.log(`✅ PDF generated from URL in ${duration}ms`);

      return filepath;

    } catch (error) {
      console.error('❌ PDF generation from URL failed:', error);
      throw error;
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (e) {
          console.error('⚠️  Error closing page:', e.message);
        }
      }
    }
  }

  /**
   * Cleanup browser and resources
   */
  async cleanup() {
    if (this.browser) {
      try {
        console.log('🧹 Closing Puppeteer browser...');
        await this.browser.close();
        this.browser = null;
        this.isInitialized = false;
        console.log('✅ Browser closed successfully');
      } catch (error) {
        console.error('❌ Error closing browser:', error);
      }
    }
  }

  /**
   * Clean up old temporary PDF files
   * @param {number} maxAgeMs - Maximum age in milliseconds (default 1 hour)
   */
  async cleanupOldFiles(maxAgeMs = 3600000) {
    try {
      const files = await fs.readdir(this.tempDir);
      const now = Date.now();
      let cleaned = 0;

      for (const file of files) {
        if (!file.endsWith('.pdf')) continue;

        const filepath = path.join(this.tempDir, file);
        const stats = await fs.stat(filepath);
        const age = now - stats.mtimeMs;

        if (age > maxAgeMs) {
          await fs.unlink(filepath);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} old PDF file(s)`);
      }
    } catch (error) {
      console.error('⚠️  Error cleaning up old files:', error);
    }
  }
}

// Export singleton instance
const puppeteerPdfService = new PuppeteerPdfService();

module.exports = puppeteerPdfService;
