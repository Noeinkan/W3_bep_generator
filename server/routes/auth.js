const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const { verificationEmail, passwordResetEmail } = require('../services/emailTemplates');
const db = require('../db/database');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validate
} = require('../validators/authValidator');

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const user = await authService.createUser(email, password, name);

    // Do not auto-login; indicate that verification was sent
    res.status(201).json({
      message: 'User registered. Verification email sent.',
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to register user' });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.authenticateUser(email, password);
    const token = authService.generateToken(user.id);

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error.message === 'Invalid email or password' || error.message === 'Account is inactive') {
      return res.status(401).json({ error: error.message });
    }

    if (error.message === 'Email not verified') {
      return res.status(403).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

/**
 * GET /api/auth/email-health
 * Email service diagnostics (non-production only)
 */
router.get('/email-health', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const status = emailService.getStatus();
    const verification = await emailService.verifyConnection();

    return res.json({
      success: true,
      email: {
        ...status,
        verification
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to check email service health'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user (protected)
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;
    const emailStatus = emailService.getStatus();

    const user = authService.getUserByEmail(email);

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    const resetToken = authService.createPasswordResetToken(user.id);
    const appBase = process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const resetUrl = `${appBase}/reset-password/${resetToken}`;
    let emailError = null;

    // Send password reset email
    try {
      const mail = passwordResetEmail({ name: user.name, resetUrl });
      await emailService.sendMail({ to: email, subject: mail.subject, text: mail.text, html: mail.html });
    } catch (err) {
      emailError = (err && err.message) || 'Unknown email delivery error';
      console.error('Failed to send password reset email:', emailError);
    }

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      ...(process.env.NODE_ENV !== 'production' && {
        resetToken,
        resetUrl,
        emailDebug: {
          configured: emailStatus.configured,
          mode: emailStatus.mode,
          from: emailStatus.from,
          sent: !emailError,
          error: emailError
        }
      })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify an email token
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    const userId = authService.verifyEmailToken(token);
    if (!userId) return res.status(400).json({ error: 'Invalid or expired token' });

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

/**
 * POST /api/auth/resend-verification
 * Resend verification email to a user's address
 */
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = authService.getUserByEmail(email);
    // Always respond with success message to avoid revealing account existence
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a verification email has been sent.' });
    }

    if (user.email_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Simple cooldown: check last token created for this user
    const cooldownMinutes = Number(process.env.RESEND_VERIFICATION_COOLDOWN_MINUTES) || 10;
    const lastToken = db.prepare('SELECT * FROM email_verification_tokens WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(user.id);
    if (lastToken) {
      const lastCreated = new Date(lastToken.created_at);
      const diffMs = Date.now() - lastCreated.getTime();
      if (diffMs < cooldownMinutes * 60 * 1000) {
        return res.status(429).json({ error: 'Please wait before requesting another verification email' });
      }
    }

    const token = authService.createEmailVerificationToken(user.id);
    const appBase = process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const verificationUrl = `${appBase}/verify-email?token=${token}`;
    const mail = verificationEmail({ name: user.name, verificationUrl });

    try {
      await emailService.sendMail({ to: email, subject: mail.subject, text: mail.text, html: mail.html });
    } catch (err) {
      console.error('Failed to send verification email:', err && err.message);
    }

    return res.json({ message: 'If an account with that email exists, a verification email has been sent.' });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  try {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);

    if (error.message === 'Invalid or expired reset token') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
