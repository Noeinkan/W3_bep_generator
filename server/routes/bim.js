/**
 * BIM / IFC import routes.
 * POST /api/bim/parse-ifc — upload .ifc file, parse with ifcParserService, return suggested deliverables.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createId } = require('@paralleldrive/cuid2');
const { authenticateToken } = require('../middleware/authMiddleware');
const ifcParserService = require('../services/ifcParserService');

const router = express.Router();
router.use(authenticateToken);

const TEMP_DIR = path.join(__dirname, '..', 'temp');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXT = '.ifc';

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, TEMP_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${createId()}${ext || '.ifc'}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ALLOWED_EXT) {
    return cb(new Error('Only .ifc files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 }
});

/**
 * POST /api/bim/parse-ifc
 * Body: multipart/form-data, field "file" (single .ifc file).
 * Returns: { projectName, author, organization, ifcSchema, fileDate, description, disciplinesFound, suggestedDeliverables }
 */
router.post('/parse-ifc', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded. Send a single .ifc file in the "file" field.' });
  }
  const filePath = file.path;
  try {
    const result = await ifcParserService.parseIfc(filePath);
    res.json(result);
  } catch (err) {
    console.error('IFC parse error:', err);
    res.status(400).json({
      error: err.message || 'Failed to parse IFC file'
    });
  } finally {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {
      console.warn('Could not delete temp IFC file:', filePath, e.message);
    }
  }
});

module.exports = router;
