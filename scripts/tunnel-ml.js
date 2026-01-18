/**
 * Start Cloudflare Tunnel for ML Service (port 8000)
 * This tunnel exposes the AI/Ollama service publicly
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Wait 20 seconds before starting ML tunnel (give ML service time to start)
const DELAY_MS = 20000;

// Function to find cloudflared executable
function findCloudflared() {
  const localPath = path.join(__dirname, '..', 'cloudflared.exe');
  if (fs.existsSync(localPath)) {
    return localPath;
  }

  const possiblePaths = [
    'C:\\Program Files\\Cloudflare\\cloudflared\\cloudflared.exe',
    'C:\\Program Files (x86)\\Cloudflare\\cloudflared\\cloudflared.exe',
  ];

  for (const cloudflaredPath of possiblePaths) {
    try {
      if (fs.existsSync(cloudflaredPath)) {
        return cloudflaredPath;
      }
    } catch (e) {
      // Continue
    }
  }

  return null;
}

console.log('\x1b[35m[ML Tunnel] Waiting 20 seconds for ML service to start...\x1b[0m');

setTimeout(() => {
  console.log('\x1b[35m[ML Tunnel] Starting Cloudflare Tunnel for AI Service...\x1b[0m');
  console.log('\x1b[35m=====================================================\x1b[0m');

  const cloudflaredPath = findCloudflared();

  if (!cloudflaredPath) {
    console.error('\x1b[33m[ML Tunnel] cloudflared not found - AI will only work locally\x1b[0m');
    return;
  }

  console.log(`\x1b[90m[ML Tunnel] Using: ${cloudflaredPath}\x1b[0m`);

  const tunnel = spawn(cloudflaredPath, ['tunnel', '--url', 'http://localhost:8000'], {
    shell: true
  });

  let tunnelUrl = null;

  tunnel.stdout.on('data', (data) => {
    const output = data.toString();
    const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);

    if (urlMatch && !tunnelUrl) {
      tunnelUrl = urlMatch[0];

      // Save ML tunnel URL to .env file
      const envPath = path.join(__dirname, '..', '.env');
      const envContent = `ML_SERVICE_URL=${tunnelUrl}\n`;

      try {
        fs.writeFileSync(envPath, envContent);
        console.log(`\x1b[32m[ML Tunnel] Saved ML_SERVICE_URL to .env\x1b[0m`);
      } catch (err) {
        console.error(`\x1b[33m[ML Tunnel] Could not write .env: ${err.message}\x1b[0m`);
      }

      console.log('\n');
      console.log('\x1b[45m\x1b[37m                                                             \x1b[0m');
      console.log('\x1b[45m\x1b[37m   🤖 AI SERVICE TUNNEL ATTIVO!                              \x1b[0m');
      console.log('\x1b[45m\x1b[37m                                                             \x1b[0m');
      console.log(`\x1b[1m\x1b[35m   ${tunnelUrl}   \x1b[0m`);
      console.log('\x1b[45m\x1b[37m                                                             \x1b[0m');
      console.log('\n');
      console.log('\x1b[32m✅ Backend configurato automaticamente - AI funzionerà da remoto!\x1b[0m\n');
    }

    if (output.includes('INF') || output.includes('ERR')) {
      console.log('\x1b[90m[ML Tunnel]', output.trim(), '\x1b[0m');
    }
  });

  tunnel.stderr.on('data', (data) => {
    const output = data.toString();
    const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);

    if (urlMatch && !tunnelUrl) {
      tunnelUrl = urlMatch[0];

      // Save ML tunnel URL to .env file
      const envPath = path.join(__dirname, '..', '.env');
      const envContent = `ML_SERVICE_URL=${tunnelUrl}\n`;

      try {
        fs.writeFileSync(envPath, envContent);
        console.log(`\x1b[32m[ML Tunnel] Saved ML_SERVICE_URL to .env\x1b[0m`);
      } catch (err) {
        console.error(`\x1b[33m[ML Tunnel] Could not write .env: ${err.message}\x1b[0m`);
      }

      console.log('\n');
      console.log('\x1b[45m\x1b[37m                                                             \x1b[0m');
      console.log('\x1b[45m\x1b[37m   🤖 AI SERVICE TUNNEL ATTIVO!                              \x1b[0m');
      console.log('\x1b[45m\x1b[37m                                                             \x1b[0m');
      console.log(`\x1b[1m\x1b[35m   ${tunnelUrl}   \x1b[0m`);
      console.log('\x1b[45m\x1b[37m                                                             \x1b[0m');
      console.log('\n');
      console.log('\x1b[32m✅ Backend configurato automaticamente - AI funzionerà da remoto!\x1b[0m\n');
    }

    console.log('\x1b[90m[ML Tunnel]', output.trim(), '\x1b[0m');
  });

  tunnel.on('error', (err) => {
    console.error('\x1b[31m[ML Tunnel] Error:', err.message, '\x1b[0m');
  });

  process.on('SIGINT', () => {
    console.log('\n\x1b[35m[ML Tunnel] Stopping...\x1b[0m');
    process.exit(0);
  });
}, DELAY_MS);
