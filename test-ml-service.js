/**
 * ML Service Health Checker
 *
 * Quick script to test if the ML service is running and ready.
 * Run with: node test-ml-service.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Get ML service URL
function getMLServiceURL() {
  try {
    const envPath = path.join(__dirname, '.env');
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

async function checkMLService() {
  const mlServiceUrl = getMLServiceURL();

  console.log('=== ML Service Health Check ===\n');
  console.log(`ML Service URL: ${mlServiceUrl}\n`);

  try {
    // Test 1: Health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${mlServiceUrl}/health`, { timeout: 5000 });
    console.log('   ✓ Health endpoint responded');
    console.log(`   Status: ${healthResponse.data.status}`);
    if (healthResponse.data.ollama) {
      console.log(`   Ollama: ${healthResponse.data.ollama.status}`);
      console.log(`   Model: ${healthResponse.data.ollama.model}`);
    }
    console.log('');

    // Test 2: Quick text generation
    console.log('2. Testing text generation...');
    const genResponse = await axios.post(`${mlServiceUrl}/generate`, {
      prompt: 'Test prompt for BIM',
      max_length: 50
    }, { timeout: 15000 });
    console.log('   ✓ Text generation works');
    console.log(`   Generated ${genResponse.data.text.length} characters`);
    console.log('');

    // Test 3: Simple EIR analysis
    console.log('3. Testing EIR analysis...');
    const analysisResponse = await axios.post(`${mlServiceUrl}/analyze-eir`, {
      text: 'Test EIR document. Project objectives: Improve coordination. BIM Level 2 required.',
      filename: 'test.pdf'
    }, { timeout: 30000 });
    console.log('   ✓ EIR analysis works');
    console.log(`   Analysis contains ${Object.keys(analysisResponse.data.analysis_json).length} sections`);
    console.log('');

    console.log('=== All Tests Passed ===');
    console.log('\nThe ML service is running correctly and ready to process documents.');

  } catch (error) {
    console.log('\n=== ML Service Issues Detected ===\n');

    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to ML service');
      console.log('\nPossible solutions:');
      console.log('1. Start the ML service:');
      console.log('   cd ml-service');
      console.log('   venv\\Scripts\\activate  (Windows)');
      console.log('   python app.py');
      console.log('');
      console.log('2. Ensure Ollama is running:');
      console.log('   ollama serve');
      console.log('');
      console.log('3. Check the ML_SERVICE_URL in .env file');
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log('❌ ML service timed out');
      console.log('\nThe service is running but too slow. Possible causes:');
      console.log('1. Ollama model not loaded or downloading');
      console.log('2. System resources (CPU/RAM) insufficient');
      console.log('3. First request initializing the model');
    } else if (error.response?.status === 500) {
      console.log('❌ ML service returned an error');
      console.log(`\nError: ${error.response.data?.error || error.message}`);
      console.log('\nCheck the ML service logs for details');
    } else {
      console.log('❌ Unexpected error');
      console.log(`\nError: ${error.message}`);
    }
  }
}

checkMLService();
