const { verifyToken, getUserById } = require('../services/authService');

// TEMPORARY: set to false to re-enable login/auth
const AUTH_DISABLED = true;
const MOCK_USER = { id: 'dev-user-1', email: 'dev@local.test', name: 'Dev User', is_active: 1 };

// Ensure the mock user row exists so FK constraints on user_id are satisfied
if (AUTH_DISABLED) {
  const db = require('../database');
  const exists = db.prepare('SELECT id FROM users WHERE id = ?').get(MOCK_USER.id);
  if (!exists) {
    const now = new Date().toISOString();
    db.prepare(
      'INSERT INTO users (id, email, password_hash, name, created_at, updated_at, is_active, email_verified) VALUES (?, ?, ?, ?, ?, ?, 1, 1)'
    ).run(MOCK_USER.id, MOCK_USER.email, 'auth-disabled', MOCK_USER.name, now, now);
    console.log('Dev mode: created mock user row in DB');
  }
  // Migrate any orphaned projects that used the old numeric id
  const orphaned = db.prepare('SELECT id FROM projects WHERE user_id = ?').all('1');
  if (orphaned.length > 0) {
    db.prepare('UPDATE projects SET user_id = ? WHERE user_id = ?').run(MOCK_USER.id, '1');
    console.log(`Dev mode: migrated ${orphaned.length} project(s) from old user_id "1" to "${MOCK_USER.id}"`);
  }
}

/**
 * Middleware to authenticate JWT token from Authorization header
 * Attaches user object to req.user if valid
 */
const authenticateToken = (req, res, next) => {
  if (AUTH_DISABLED) {
    req.user = MOCK_USER;
    return next();
  }
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const user = getUserById(payload.userId);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (!user.is_active) {
    return res.status(401).json({ error: 'Account is inactive' });
  }

  // Attach user to request
  req.user = user;
  next();
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't block if missing/invalid
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      const user = getUserById(payload.userId);
      if (user && user.is_active) {
        req.user = user;
      }
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};
