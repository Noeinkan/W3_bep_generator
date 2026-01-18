const { exec, spawn } = require('child_process');
const http = require('http');

const OLLAMA_PORT = 11434;
const CHECK_INTERVAL = 1000;
const MAX_WAIT = 30000;

function checkOllamaRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${OLLAMA_PORT}/api/tags`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForOllama(startTime = Date.now()) {
  const isRunning = await checkOllamaRunning();
  if (isRunning) {
    console.log('✓ Ollama is running');
    return true;
  }

  if (Date.now() - startTime > MAX_WAIT) {
    console.error('✗ Timeout waiting for Ollama to start');
    return false;
  }

  await new Promise(r => setTimeout(r, CHECK_INTERVAL));
  return waitForOllama(startTime);
}

async function startOllama() {
  console.log('Checking if Ollama is running...');

  const alreadyRunning = await checkOllamaRunning();
  if (alreadyRunning) {
    console.log('✓ Ollama is already running');
    return true;
  }

  console.log('Starting Ollama...');

  // Try to start Ollama (Windows)
  const ollamaProcess = spawn('ollama', ['serve'], {
    detached: true,
    stdio: 'ignore',
    shell: true,
    windowsHide: true
  });

  ollamaProcess.unref();

  // Wait for Ollama to be ready
  const started = await waitForOllama();

  if (!started) {
    console.error('\n========================================');
    console.error('Failed to start Ollama automatically.');
    console.error('Please ensure Ollama is installed:');
    console.error('  Download from: https://ollama.com');
    console.error('');
    console.error('After installing, run:');
    console.error('  ollama pull llama3.2:3b');
    console.error('========================================\n');
    process.exit(1);
  }

  return true;
}

startOllama().catch((err) => {
  console.error('Error starting Ollama:', err.message);
  process.exit(1);
});
