/**
 * Script to start Cloudflare Tunnel with automatic browser opening
 * - Waits for services to be ready
 * - Starts the tunnel
 * - Captures and highlights the URL
 * - Opens browser automatically
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Wait 15 seconds before starting tunnel
const DELAY_MS = 15000;

// Function to find cloudflared executable
function findCloudflared() {
  // First check local project directory
  const localPath = path.join(__dirname, '..', 'cloudflared.exe');
  if (fs.existsSync(localPath)) {
    return localPath;
  }

  const possiblePaths = [
    'C:\\Program Files\\Cloudflare\\cloudflared\\cloudflared.exe',
    'C:\\Program Files (x86)\\Cloudflare\\cloudflared\\cloudflared.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft\\WinGet\\Packages\\Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe\\cloudflared.exe'),
  ];

  for (const cloudflaredPath of possiblePaths) {
    try {
      if (fs.existsSync(cloudflaredPath)) {
        return cloudflaredPath;
      }
    } catch (e) {
      // Continue to next path
    }
  }

  return null;
}

console.log('\x1b[36m[Tunnel] Waiting 15 seconds for services to start...\x1b[0m');

setTimeout(() => {
  console.log('\x1b[36m[Tunnel] Starting Cloudflare Tunnel...\x1b[0m');
  console.log('\x1b[36m=====================================================\x1b[0m');

  const cloudflaredPath = findCloudflared();

  if (!cloudflaredPath) {
    console.error('\n');
    console.error('\x1b[41m\x1b[37m                                                    \x1b[0m');
    console.error('\x1b[41m\x1b[37m   ⚠️  TUNNEL NON DISPONIBILE                        \x1b[0m');
    console.error('\x1b[41m\x1b[37m                                                    \x1b[0m');
    console.error('\n');
    console.error('\x1b[33m[Tunnel] cloudflared installato ma non ancora nel PATH.\x1b[0m');
    console.error('\x1b[33m[Tunnel] \x1b[0m');
    console.error('\x1b[33m[Tunnel] Per abilitare il tunnel:\x1b[0m');
    console.error('\x1b[36m[Tunnel] 1. Apri un NUOVO terminale (chiudi e riapri)\x1b[0m');
    console.error('\x1b[36m[Tunnel] 2. Lancia: npm run tunnel\x1b[0m');
    console.error('\x1b[33m[Tunnel] \x1b[0m');
    console.error('\x1b[33m[Tunnel] Oppure usa: start-tunnel-only.bat\x1b[0m');
    console.error('\n');
    console.error('\x1b[32m✅ L\'app funziona comunque su http://localhost:3000\x1b[0m');
    console.error('\n');
    return; // Don't exit, let other services continue
  }

  console.log(`\x1b[90m[Tunnel] Using cloudflared at: ${cloudflaredPath}\x1b[0m`);

  const tunnel = spawn(cloudflaredPath, ['tunnel', '--url', 'http://localhost:3000'], {
    shell: true
  });

  let tunnelUrl = null;

  tunnel.stdout.on('data', (data) => {
    const output = data.toString();

    // Look for the tunnel URL
    const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);

    if (urlMatch && !tunnelUrl) {
      tunnelUrl = urlMatch[0];

      // Print highlighted URL
      console.log('\n');
      console.log('\x1b[42m\x1b[30m                                                    \x1b[0m');
      console.log('\x1b[42m\x1b[30m   🚀 TUNNEL ATTIVO! Copia questo URL:              \x1b[0m');
      console.log('\x1b[42m\x1b[30m                                                    \x1b[0m');
      console.log('\x1b[1m\x1b[32m   ' + tunnelUrl + '   \x1b[0m');
      console.log('\x1b[42m\x1b[30m                                                    \x1b[0m');
      console.log('\n');
      console.log('\x1b[33m📱 Condividi questo URL con chiunque per la demo!\x1b[0m');
      console.log('\x1b[36m🌐 Aprendo il browser...\x1b[0m\n');

      // Open browser
      const openCommand = process.platform === 'win32'
        ? `start ${tunnelUrl}`
        : process.platform === 'darwin'
        ? `open ${tunnelUrl}`
        : `xdg-open ${tunnelUrl}`;

      exec(openCommand, (error) => {
        if (error) {
          console.error('\x1b[31m[Tunnel] Errore apertura browser:', error.message, '\x1b[0m');
        }
      });
    }

    // Print tunnel logs
    if (output.includes('INF') || output.includes('ERR')) {
      console.log('\x1b[90m[Tunnel]', output.trim(), '\x1b[0m');
    }
  });

  tunnel.stderr.on('data', (data) => {
    const output = data.toString();

    // Look for URL in stderr too (sometimes cloudflared outputs there)
    const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);

    if (urlMatch && !tunnelUrl) {
      tunnelUrl = urlMatch[0];

      // Print highlighted URL
      console.log('\n');
      console.log('\x1b[42m\x1b[30m                                                    \x1b[0m');
      console.log('\x1b[42m\x1b[30m   🚀 TUNNEL ATTIVO! Copia questo URL:              \x1b[0m');
      console.log('\x1b[42m\x1b[30m                                                    \x1b[0m');
      console.log('\x1b[1m\x1b[32m   ' + tunnelUrl + '   \x1b[0m');
      console.log('\x1b[42m\x1b[30m                                                    \x1b[0m');
      console.log('\n');
      console.log('\x1b[33m📱 Condividi questo URL con chiunque per la demo!\x1b[0m');
      console.log('\x1b[36m🌐 Aprendo il browser...\x1b[0m\n');

      // Open browser
      const openCommand = process.platform === 'win32'
        ? `start ${tunnelUrl}`
        : process.platform === 'darwin'
        ? `open ${tunnelUrl}`
        : `xdg-open ${tunnelUrl}`;

      exec(openCommand, (error) => {
        if (error) {
          console.error('\x1b[31m[Tunnel] Errore apertura browser:', error.message, '\x1b[0m');
        }
      });
    }

    console.log('\x1b[90m[Tunnel]', output.trim(), '\x1b[0m');
  });

  tunnel.on('error', (err) => {
    console.error('\x1b[31m[Tunnel] Failed to start:', err.message, '\x1b[0m');
    console.error('\x1b[31m[Tunnel] Make sure cloudflared is installed:\x1b[0m');
    console.error('\x1b[31m[Tunnel]   winget install --id Cloudflare.cloudflared\x1b[0m');
  });

  tunnel.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`\x1b[33m[Tunnel] Exited with code ${code}\x1b[0m`);
    }
  });
}, DELAY_MS);

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\x1b[33m[Tunnel] Stopping...\x1b[0m');
  process.exit(0);
});
