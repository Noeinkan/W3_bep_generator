const { verifyToken, getUserById } = require('../services/authService');

// TEMPORARY: set to false to re-enable login/auth
const AUTH_DISABLED = true;
const MOCK_USER = { id: 1, email: 'dev@local.test', name: 'Dev User', is_active: 1 };

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
