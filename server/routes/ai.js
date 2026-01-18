/**
 * AI Text Generation Routes
 *
 * Provides endpoints for AI-assisted text generation in BEP documents.
 * Acts as a proxy to the Python ML service.
 */

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Configuration for ML service
const ML_SERVICE_TIMEOUT = 30000; // 30 seconds

// Function to get current ML service URL
function getMLServiceURL() {
  // Try to read from .env file for dynamic tunnel URL
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

  // Fallback to environment variable or localhost
  return process.env.ML_SERVICE_URL || 'http://localhost:8000';
}

// Create axios instance with dynamic config
function getMLClient() {
  const baseURL = getMLServiceURL();
  return axios.create({
    baseURL,
    timeout: ML_SERVICE_TIMEOUT,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Health check for ML service
 */
router.get('/health', async (req, res) => {
  try {
    const mlClient = getMLClient();
    const mlServiceURL = getMLServiceURL();
    const response = await mlClient.get('/health', { timeout: 5000 });
    res.json({
      status: 'ok',
      ml_service: response.data,
      ml_service_url: mlServiceURL
    });
  } catch (error) {
    console.error('ML service health check failed:', error.message);
    res.status(503).json({
      status: 'error',
      message: 'ML service unavailable',
      details: error.message,
      ml_service_url: getMLServiceURL()
    });
  }
});

/**
 * Generate text based on a prompt
 *
 * POST /api/ai/generate
 * Body: {
 *   prompt: string,
 *   field_type?: string,
 *   max_length?: number,
 *   temperature?: number
 * }
 */
router.post('/generate', async (req, res) => {
  try {
    const {
      prompt,
      field_type,
      max_length = 200,
      temperature = 0.7
    } = req.body;

    // Validate request
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt is required and must be a string'
      });
    }

    if (prompt.length > 1000) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Prompt too long (max 1000 characters)'
      });
    }

    console.log(`AI generation request: field_type=${field_type}, prompt_length=${prompt.length}`);

    // Call ML service with dynamic URL
    const mlClient = getMLClient();
    const response = await mlClient.post('/generate', {
      prompt,
      field_type,
      max_length: Math.min(Math.max(max_length, 50), 1000),
      temperature: Math.min(Math.max(temperature, 0.1), 2.0)
    });

    res.json({
      success: true,
      text: response.data.text,
      prompt_used: response.data.prompt_used
    });

  } catch (error) {
    console.error('AI generation error:', error.message);

    if (error.response) {
      // ML service returned an error
      return res.status(error.response.status).json({
        success: false,
        error: 'Generation failed',
        message: error.response.data.detail || error.message
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'ML service unavailable',
        message: 'AI text generation service is not running. Please start it with: cd ml-service && start_service.bat'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Generate field-specific suggestions
 *
 * POST /api/ai/suggest
 * Body: {
 *   field_type: string,
 *   partial_text?: string,
 *   max_length?: number
 * }
 */
router.post('/suggest', async (req, res) => {
  try {
    const {
      field_type,
      partial_text = '',
      max_length = 200
    } = req.body;

    // Validate request
    if (!field_type || typeof field_type !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'field_type is required and must be a string'
      });
    }

    console.log(`AI suggestion request: field_type=${field_type}, partial_length=${partial_text.length}`);

    // Call ML service with dynamic URL
    const mlClient = getMLClient();
    const response = await mlClient.post('/suggest', {
      field_type,
      partial_text,
      max_length: Math.min(Math.max(max_length, 50), 1000)
    });

    res.json({
      success: true,
      text: response.data.text,
      prompt_used: response.data.prompt_used
    });

  } catch (error) {
    console.error('AI suggestion error:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: 'Suggestion failed',
        message: error.response.data.detail || error.message
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'ML service unavailable',
        message: 'AI text generation service is not running. Please start it with: cd ml-service && start_service.bat'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Get available field types for suggestions
 */
router.get('/field-types', (req, res) => {
  res.json({
    field_types: [
      'projectName',
      'projectDescription',
      'executiveSummary',
      'projectObjectives',
      'bimObjectives',
      'projectScope',
      'stakeholders',
      'rolesResponsibilities',
      'deliveryTeam',
      'collaborationProcedures',
      'informationExchange',
      'cdeWorkflow',
      'modelRequirements',
      'dataStandards',
      'namingConventions',
      'qualityAssurance',
      'validationChecks',
      'technologyStandards',
      'softwarePlatforms',
      'coordinationProcess',
      'clashDetection',
      'healthSafety',
      'handoverRequirements',
      'asbuiltRequirements',
      'cobieRequirements'
    ]
  });
});

module.exports = router;
