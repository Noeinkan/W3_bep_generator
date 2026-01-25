/**
 * Client Documents Routes
 *
 * Handles upload, storage, and analysis of client-provided documents (EIR, etc.)
 * for BEP generation assistance.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { createId } = require('@paralleldrive/cuid2');
const db = require('../db/database');

const router = express.Router();

// Configuration
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword' // .doc (legacy)
];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Get ML Service URL
function getMLServiceURL() {
  try {
    const envPath = path.join(__dirname, '..', '..', '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/ML_SERVICE_URL=(.+)/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  } catch (err) {
    console.warn('Could not read .env file:', err.message);
  }
  return process.env.ML_SERVICE_URL || 'http://localhost:8000';
}

// Configure multer storage
// Note: We upload to a common directory first because req.body may not be
// available in the destination callback when using multipart/form-data
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename preserving extension
    const ext = path.extname(file.originalname);
    const uniqueName = `${createId()}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed types: PDF, DOCX`), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Max 5 files per upload
  }
});

/**
 * POST /api/documents/upload
 * Upload one or more documents
 */
router.post('/upload', upload.array('files', 5), async (req, res) => {
  try {
    const { userId, draftId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const documents = [];
    const now = new Date().toISOString();

    for (const file of req.files) {
      const id = createId();

      const stmt = db.prepare(`
        INSERT INTO client_documents (
          id, draft_id, user_id, filename, original_filename,
          filepath, file_size, mime_type, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'uploaded', ?, ?)
      `);

      stmt.run(
        id,
        draftId || null,
        userId,
        file.filename,
        file.originalname,
        file.path,
        file.size,
        file.mimetype,
        now,
        now
      );

      documents.push({
        id,
        filename: file.filename,
        originalFilename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        status: 'uploaded',
        createdAt: now
      });
    }

    res.status(201).json({
      success: true,
      message: `${documents.length} file(s) uploaded successfully`,
      documents
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

/**
 * GET /api/documents
 * List documents for a user/draft
 */
router.get('/', async (req, res) => {
  try {
    const { userId, draftId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    let query = 'SELECT * FROM client_documents WHERE user_id = ?';
    const params = [userId];

    if (draftId) {
      query += ' AND draft_id = ?';
      params.push(draftId);
    }

    query += ' ORDER BY created_at DESC';

    const documents = db.prepare(query).all(...params);

    // Parse JSON fields
    const parsedDocs = documents.map(doc => ({
      ...doc,
      analysisJson: doc.analysis_json ? JSON.parse(doc.analysis_json) : null
    }));

    res.json({
      success: true,
      documents: parsedDocs
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
      error: error.message
    });
  }
});

/**
 * GET /api/documents/:id
 * Get a specific document
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const document = db.prepare(`
      SELECT * FROM client_documents WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      document: {
        ...document,
        analysisJson: document.analysis_json ? JSON.parse(document.analysis_json) : null
      }
    });

  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document',
      error: error.message
    });
  }
});

/**
 * DELETE /api/documents/:id
 * Delete a document
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const document = db.prepare(`
      SELECT * FROM client_documents WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from disk
    if (fs.existsSync(document.filepath)) {
      fs.unlinkSync(document.filepath);
    }

    // Delete from database
    db.prepare('DELETE FROM client_documents WHERE id = ?').run(id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
});

/**
 * POST /api/documents/:id/extract
 * Extract text from a document
 */
router.post('/:id/extract', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const document = db.prepare(`
      SELECT * FROM client_documents WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update status to extracting
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE client_documents SET status = 'extracting', updated_at = ? WHERE id = ?
    `).run(now, id);

    try {
      // Read file and send to ML service
      const fileBuffer = fs.readFileSync(document.filepath);
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: document.original_filename,
        contentType: document.mime_type
      });

      const mlServiceUrl = getMLServiceURL();
      const response = await axios.post(`${mlServiceUrl}/extract-text`, formData, {
        headers: formData.getHeaders(),
        timeout: 120000, // 2 minutes
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      const { text, pages, word_count } = response.data;

      // Update document with extracted text
      db.prepare(`
        UPDATE client_documents
        SET extracted_text = ?, status = 'extracted', updated_at = ?
        WHERE id = ?
      `).run(text, new Date().toISOString(), id);

      res.json({
        success: true,
        message: 'Text extracted successfully',
        data: {
          textLength: text.length,
          pages,
          wordCount: word_count
        }
      });

    } catch (mlError) {
      console.error('ML service error:', mlError.message);

      // Update status to error
      db.prepare(`
        UPDATE client_documents
        SET status = 'error', error_message = ?, updated_at = ?
        WHERE id = ?
      `).run(mlError.message, new Date().toISOString(), id);

      res.status(503).json({
        success: false,
        message: 'Text extraction failed',
        error: mlError.message
      });
    }

  } catch (error) {
    console.error('Extract error:', error);
    res.status(500).json({
      success: false,
      message: 'Extraction failed',
      error: error.message
    });
  }
});

/**
 * POST /api/documents/:id/analyze
 * Analyze document with AI
 */
router.post('/:id/analyze', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const document = db.prepare(`
      SELECT * FROM client_documents WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (!document.extracted_text) {
      return res.status(400).json({
        success: false,
        message: 'Document text not extracted yet. Call /extract first.'
      });
    }

    // Update status to analyzing
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE client_documents SET status = 'analyzing', updated_at = ? WHERE id = ?
    `).run(now, id);

    try {
      const mlServiceUrl = getMLServiceURL();
      const response = await axios.post(`${mlServiceUrl}/analyze-eir`, {
        text: document.extracted_text,
        filename: document.original_filename
      }, {
        timeout: 180000 // 3 minutes for AI analysis
      });

      const { analysis_json, summary_markdown } = response.data;

      // Update document with analysis
      db.prepare(`
        UPDATE client_documents
        SET analysis_json = ?, summary_markdown = ?, status = 'analyzed', updated_at = ?
        WHERE id = ?
      `).run(
        JSON.stringify(analysis_json),
        summary_markdown,
        new Date().toISOString(),
        id
      );

      res.json({
        success: true,
        message: 'Document analyzed successfully',
        data: {
          analysisJson: analysis_json,
          summaryMarkdown: summary_markdown
        }
      });

    } catch (mlError) {
      console.error('ML service error:', mlError.message);

      // Update status to error
      db.prepare(`
        UPDATE client_documents
        SET status = 'error', error_message = ?, updated_at = ?
        WHERE id = ?
      `).run(mlError.message, new Date().toISOString(), id);

      res.status(503).json({
        success: false,
        message: 'Analysis failed',
        error: mlError.message
      });
    }

  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({
      success: false,
      message: 'Analysis failed',
      error: error.message
    });
  }
});

/**
 * POST /api/documents/:id/extract-and-analyze
 * Combined endpoint: extract text and analyze in one call
 */
router.post('/:id/extract-and-analyze', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const document = db.prepare(`
      SELECT * FROM client_documents WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const mlServiceUrl = getMLServiceURL();
    let extractedText = document.extracted_text;

    // Step 1: Extract if needed
    if (!extractedText) {
      db.prepare(`
        UPDATE client_documents SET status = 'extracting', updated_at = ? WHERE id = ?
      `).run(new Date().toISOString(), id);

      const fileBuffer = fs.readFileSync(document.filepath);
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: document.original_filename,
        contentType: document.mime_type
      });

      const extractResponse = await axios.post(`${mlServiceUrl}/extract-text`, formData, {
        headers: formData.getHeaders(),
        timeout: 120000
      });

      extractedText = extractResponse.data.text;

      db.prepare(`
        UPDATE client_documents
        SET extracted_text = ?, status = 'extracted', updated_at = ?
        WHERE id = ?
      `).run(extractedText, new Date().toISOString(), id);
    }

    // Step 2: Analyze
    db.prepare(`
      UPDATE client_documents SET status = 'analyzing', updated_at = ? WHERE id = ?
    `).run(new Date().toISOString(), id);

    const analyzeResponse = await axios.post(`${mlServiceUrl}/analyze-eir`, {
      text: extractedText,
      filename: document.original_filename
    }, {
      timeout: 180000
    });

    const { analysis_json, summary_markdown } = analyzeResponse.data;

    // Update document with analysis
    db.prepare(`
      UPDATE client_documents
      SET analysis_json = ?, summary_markdown = ?, status = 'analyzed', updated_at = ?
      WHERE id = ?
    `).run(
      JSON.stringify(analysis_json),
      summary_markdown,
      new Date().toISOString(),
      id
    );

    res.json({
      success: true,
      message: 'Document extracted and analyzed successfully',
      data: {
        analysisJson: analysis_json,
        summaryMarkdown: summary_markdown
      }
    });

  } catch (error) {
    console.error('Extract and analyze error:', error);

    // Update status to error
    db.prepare(`
      UPDATE client_documents
      SET status = 'error', error_message = ?, updated_at = ?
      WHERE id = ?
    `).run(error.message, new Date().toISOString(), req.params.id);

    res.status(500).json({
      success: false,
      message: 'Processing failed',
      error: error.message
    });
  }
});

/**
 * PUT /api/documents/:id/link-draft
 * Link a document to a draft
 */
router.put('/:id/link-draft', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, draftId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const document = db.prepare(`
      SELECT * FROM client_documents WHERE id = ? AND user_id = ?
    `).get(id, userId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    db.prepare(`
      UPDATE client_documents SET draft_id = ?, updated_at = ? WHERE id = ?
    `).run(draftId || null, new Date().toISOString(), id);

    res.json({
      success: true,
      message: 'Document linked to draft successfully'
    });

  } catch (error) {
    console.error('Link draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to link document to draft',
      error: error.message
    });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files per upload'
      });
    }
  }

  if (error.message && error.message.includes('File type not allowed')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
});

module.exports = router;
