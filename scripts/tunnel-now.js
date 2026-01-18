/**
 * Start Cloudflare Tunnel immediately (no delay)
 * For manual use when services are already running
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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

console.log('\x1b[36m[Tunnel] Starting Cloudflare Tunnel...\x1b[0m');
console.log('\x1b[36m=====================================================\x1b[0m');

const cloudflaredPath = findCloudflared();

if (!cloudflaredPath) {
  console.error('\n');
  console.error('\x1b[41m\x1b[37m                                                    \x1b[0m');
  console.error('\x1b[41m\x1b[37m   ⚠️  cloudflared NON TROVATO                       \x1b[0m');
  console.error('\x1b[41m\x1b[37m                                                    \x1b[0m');
  console.error('\n');
  console.error('\x1b[33mCloudflared è stato installato ma non trovato automaticamente.\x1b[0m');
  console.error('\x1b[33m\x1b[0m');
  console.error('\x1b[33mSoluzione rapida:\x1b[0m');
  console.error('\x1b[36m1. Usa lo script batch: .\\start-tunnel-only.bat\x1b[0m');
  console.error('\x1b[36m2. Oppure riavvia il PC per aggiornare il PATH\x1b[0m');
  console.error('\n');
  process.exit(1);
}

console.log(`\x1b[90m[Tunnel] Using: ${cloudflaredPath}\x1b[0m\n`);

const tunnel = spawn(cloudflaredPath, ['tunnel', '--url', 'http://localhost:3000'], {
  shell: true
});

let tunnelUrl = null;

tunnel.stdout.on('data', (data) => {
  const output = data.toString();
  const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);

  if (urlMatch && !tunnelUrl) {
    tunnelUrl = urlMatch[0];

    // Print highlighted URL
    console.log('\n');
    console.log('\x1b[42m\x1b[30m                                                             \x1b[0m');
    console.log('\x1b[42m\x1b[30m   🚀 TUNNEL ATTIVO! Copia questo URL:                       \x1b[0m');
    console.log('\x1b[42m\x1b[30m                                                             \x1b[0m');
    console.log(`\x1b[1m\x1b[32m   ${tunnelUrl}   \x1b[0m`);
    console.log('\x1b[42m\x1b[30m                                                             \x1b[0m');
    console.log('\n');
    console.log('\x1b[33m📱 Condividi questo URL per la demo!\x1b[0m');
    console.log('\x1b[36m🌐 Aprendo il browser...\x1b[0m\n');

    // Open browser
    const openCommand = process.platform === 'win32'
      ? `start ${tunnelUrl}`
      : process.platform === 'darwin'
      ? `open ${tunnelUrl}`
      : `xdg-open ${tunnelUrl}`;

    exec(openCommand);
  }

  if (output.includes('INF') || output.includes('ERR')) {
    console.log('\x1b[90m[Tunnel]', output.trim(), '\x1b[0m');
  }
});

tunnel.stderr.on('data', (data) => {
  const output = data.toString();
  const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);

  if (urlMatch && !tunnelUrl) {
    tunnelUrl = urlMatch[0];
    console.log('\n');
    console.log('\x1b[42m\x1b[30m                                                             \x1b[0m');
    console.log('\x1b[42m\x1b[30m   🚀 TUNNEL ATTIVO! Copia questo URL:                       \x1b[0m');
    console.log('\x1b[42m\x1b[30m                                                             \x1b[0m');
    console.log(`\x1b[1m\x1b[32m   ${tunnelUrl}   \x1b[0m`);
    console.log('\x1b[42m\x1b[30m                                                             \x1b[0m');
    console.log('\n');
    console.log('\x1b[33m📱 Condividi questo URL per la demo!\x1b[0m');
    console.log('\x1b[36m🌐 Aprendo il browser...\x1b[0m\n');

    const openCommand = process.platform === 'win32' ? `start ${tunnelUrl}` : process.platform === 'darwin' ? `open ${tunnelUrl}` : `xdg-open ${tunnelUrl}`;
    exec(openCommand);
  }

  console.log('\x1b[90m[Tunnel]', output.trim(), '\x1b[0m');
});

tunnel.on('error', (err) => {
  console.error('\x1b[31m[Tunnel] Error:', err.message, '\x1b[0m');
});

process.on('SIGINT', () => {
  console.log('\n\x1b[33m[Tunnel] Stopping...\x1b[0m');
  process.exit(0);
});
