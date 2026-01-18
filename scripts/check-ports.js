/**
 * Check and free ports before starting services
 *
 * Checks if ports 3000, 3001, and 8000 are in use and attempts to free them
 */

const { execSync } = require('child_process');
const os = require('os');

const PORTS = {
  frontend: 3000,
  backend: 3001,
  ml: 8000
};

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function getProcessOnPort(port) {
  try {
    if (os.platform() === 'win32') {
      // Windows: use netstat
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const lines = output.trim().split('\n');

      for (const line of lines) {
        // Look for LISTENING state
        if (line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          return pid;
        }
      }
    } else {
      // Unix-like: use lsof
      const output = execSync(`lsof -ti:${port}`, { encoding: 'utf8' });
      return output.trim();
    }
  } catch (error) {
    // No process found on this port
    return null;
  }
  return null;
}

function killProcess(pid) {
  try {
    if (os.platform() === 'win32') {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    } else {
      execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
    }
    return true;
  } catch (error) {
    return false;
  }
}

function checkAndFreePort(port, serviceName) {
  const pid = getProcessOnPort(port);

  if (pid) {
    log(`⚠️  Port ${port} (${serviceName}) is in use by PID ${pid}`, 'yellow');
    log(`   Attempting to free the port...`, 'cyan');

    if (killProcess(pid)) {
      log(`   ✓ Successfully freed port ${port}`, 'green');
      // Wait a moment for the port to be released
      const start = Date.now();
      while (Date.now() - start < 1000) {
        // Busy wait for 1 second
      }
      return true;
    } else {
      log(`   ✗ Failed to free port ${port}`, 'red');
      log(`   Please manually close the process with PID ${pid}`, 'red');
      return false;
    }
  } else {
    log(`✓ Port ${port} (${serviceName}) is available`, 'green');
    return true;
  }
}

function main() {
  log('\n============================================================', 'blue');
  log('BEP Generator - Port Availability Check', 'blue');
  log('============================================================\n', 'blue');

  log('Checking required ports...\n', 'cyan');

  let allPortsAvailable = true;

  // Check all ports
  allPortsAvailable &= checkAndFreePort(PORTS.frontend, 'React Frontend');
  allPortsAvailable &= checkAndFreePort(PORTS.backend, 'Node.js Backend');
  allPortsAvailable &= checkAndFreePort(PORTS.ml, 'Python ML Service');

  log('\n============================================================\n', 'blue');

  if (allPortsAvailable) {
    log('✓ All ports are available. Starting services...\n', 'green');
    process.exit(0);
  } else {
    log('✗ Some ports could not be freed. Please check manually.\n', 'red');
    log('To manually check ports:', 'yellow');
    if (os.platform() === 'win32') {
      log('  netstat -ano | findstr :3000', 'cyan');
      log('  netstat -ano | findstr :3001', 'cyan');
      log('  netstat -ano | findstr :8000', 'cyan');
      log('\nTo kill a process:', 'yellow');
      log('  taskkill /PID <PID> /F\n', 'cyan');
    } else {
      log('  lsof -ti:3000', 'cyan');
      log('  lsof -ti:3001', 'cyan');
      log('  lsof -ti:8000', 'cyan');
      log('\nTo kill a process:', 'yellow');
      log('  kill -9 <PID>\n', 'cyan');
    }
    process.exit(1);
  }
}

main();
