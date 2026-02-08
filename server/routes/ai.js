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

/**
 * Generate suggestions based on EIR analysis
 *
 * POST /api/ai/suggest-from-eir
 * Body: {
 *   analysis_json: object,
 *   field_type: string,
 *   partial_text?: string
 * }
 */
router.post('/suggest-from-eir', async (req, res) => {
  try {
    const {
      analysis_json,
      field_type,
      partial_text = ''
    } = req.body;

    // Validate request
    if (!analysis_json || typeof analysis_json !== 'object') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'analysis_json is required and must be an object'
      });
    }

    if (!field_type || typeof field_type !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'field_type is required and must be a string'
      });
    }

    console.log(`EIR suggestion request: field_type=${field_type}`);

    // Call ML service
    const mlClient = getMLClient();
    const response = await mlClient.post('/suggest-from-eir', {
      analysis_json,
      field_type,
      partial_text
    }, {
      timeout: 60000 // 60 seconds for EIR suggestions
    });

    res.json({
      success: true,
      suggestion: response.data.suggestion,
      field_type: response.data.field_type,
      model: response.data.model
    });

  } catch (error) {
    console.error('EIR suggestion error:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: 'EIR suggestion failed',
        message: error.response.data.detail || error.message
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'ML service unavailable',
        message: 'AI service is not running'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// ============================================================================
// Guided AI: Question-based Content Generation
// ============================================================================

/**
 * Generate contextual questions for a BEP field
 *
 * POST /api/ai/generate-questions
 * Body: {
 *   field_type: string,
 *   field_label: string,
 *   field_context?: { step_name, step_number, existing_fields, draft_id }
 * }
 */
router.post('/generate-questions', async (req, res) => {
  try {
    const { field_type, field_label, field_context, help_content } = req.body;

    // Validate request
    if (!field_type || typeof field_type !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'field_type is required and must be a string'
      });
    }

    if (!field_label || typeof field_label !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'field_label is required and must be a string'
      });
    }

    console.log(`Guided AI: generating questions for field_type=${field_type}${help_content ? ' (with guidelines)' : ''}`);

    const mlClient = getMLClient();
    const response = await mlClient.post('/generate-questions', {
      field_type,
      field_label,
      field_context: field_context || null,
      help_content: help_content || null
    }, {
      timeout: 30000 // 30s for question generation
    });

    res.json({
      success: true,
      questions: response.data.questions,
      field_type: response.data.field_type
    });

  } catch (error) {
    console.error('Guided AI question generation error:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: 'Question generation failed',
        message: error.response.data.detail || error.message
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'ML service unavailable',
        message: 'AI service is not running. Please start the ML service.'
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        error: 'Request timeout',
        message: 'Question generation timed out. Please try again.'
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
 * Generate content from user answers to guided questions
 *
 * POST /api/ai/generate-from-answers
 * Body: {
 *   field_type: string,
 *   field_label?: string,
 *   session_id?: string,
 *   answers: [{ question_id, question_text, answer }],
 *   field_context?: object
 * }
 */
router.post('/generate-from-answers', async (req, res) => {
  try {
    const { field_type, field_label, session_id, answers, field_context } = req.body;

    // Validate request
    if (!field_type || typeof field_type !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'field_type is required and must be a string'
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'answers must be an array'
      });
    }

    // Truncate long answers (max 500 chars each)
    const sanitizedAnswers = answers.map(a => ({
      question_id: a.question_id,
      question_text: a.question_text,
      answer: a.answer ? String(a.answer).slice(0, 500) : null
    }));

    const answeredCount = sanitizedAnswers.filter(a => a.answer).length;
    console.log(`Guided AI: generating from ${answeredCount}/${sanitizedAnswers.length} answers for field_type=${field_type}`);

    const mlClient = getMLClient();
    const response = await mlClient.post('/generate-from-answers', {
      field_type,
      field_label: field_label || field_type,
      session_id: session_id || null,
      answers: sanitizedAnswers,
      field_context: field_context || null
    }, {
      timeout: 60000 // 60s for content generation
    });

    res.json({
      success: true,
      text: response.data.text,
      questions_answered: response.data.questions_answered,
      questions_total: response.data.questions_total,
      model: response.data.model
    });

  } catch (error) {
    console.error('Guided AI content generation error:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: 'Content generation failed',
        message: error.response.data.detail || error.message
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'ML service unavailable',
        message: 'AI service is not running. Please start the ML service.'
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        error: 'Request timeout',
        message: 'Content generation timed out. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;