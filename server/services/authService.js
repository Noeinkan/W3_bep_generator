const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const emailService = require('./emailService');
const { verificationEmail, passwordResetEmail } = require('./emailTemplates');

/**
 * Seed a "Sample Project" for a user if they have no projects yet.
 * Called server-side so new users always have a project available.
 * Safe to call multiple times — no-ops if a project already exists.
 */
const SAMPLE_LOIN_ROWS = [
  { discipline: 'Architecture', stage: 'Concept Design',   element: 'External Walls',      geometry: '2D outline in plan and elevation', alphanumeric: 'Construction type, approximate U-value, fire rating', documentation: 'Outline specification' },
  { discipline: 'Architecture', stage: 'Technical Design', element: 'External Walls',      geometry: '3D solid model LOD 300; all openings, cills, lintels', alphanumeric: 'Material, U-value, fire rating, acoustic rating, finish, manufacturer', documentation: 'Product data sheets, full specifications' },
  { discipline: 'Architecture', stage: 'Handover',         element: 'External Walls',      geometry: 'As-built 3D model LOD 400', alphanumeric: 'Manufacturer, product reference, warranty period, maintenance intervals', documentation: 'As-built drawings, O&M manual, warranties' },
  { discipline: 'Structure',    stage: 'Concept Design',   element: 'Foundations',         geometry: '2D footprint with indicative depth', alphanumeric: 'Foundation type, indicative load assumptions, soil bearing capacity', documentation: 'Structural concept report' },
  { discipline: 'Structure',    stage: 'Technical Design', element: 'Columns & Beams',     geometry: '3D solid model LOD 300; exact section sizes and positions', alphanumeric: 'Steel grade, section reference, design load capacity, connection type', documentation: 'Structural calculations, connection details' },
  { discipline: 'MEP',          stage: 'Developed Design', element: 'HVAC Ductwork',       geometry: '3D duct routing — major plant and primary distribution only', alphanumeric: 'Supply/extract air flow rates, duct sizes, pressure drop', documentation: 'Equipment schedules, ventilation design report' },
  { discipline: 'MEP',          stage: 'Technical Design', element: 'Electrical — Lighting', geometry: '3D positions of luminaires and distribution boards', alphanumeric: 'Wattage, IP rating, circuit reference, design lux levels', documentation: 'Electrical circuit drawings, luminaire schedule' },
  { discipline: 'Civil',        stage: 'Concept Design',   element: 'Site Drainage',       geometry: '2D drainage network layout, pipe routes and invert levels', alphanumeric: 'Pipe material, approximate sizes, gradients', documentation: 'Drainage strategy report' },
  { discipline: 'Civil',        stage: 'Technical Design', element: 'Site Roads & Paths',  geometry: '3D alignment and finished levels, kerb details', alphanumeric: 'Surfacing specification, construction depth, sub-base type', documentation: 'Highways specification, drainage drawings' },
  { discipline: 'Fire Protection', stage: 'Technical Design', element: 'Sprinkler System', geometry: '3D head positions and main pipework LOD 300', alphanumeric: 'Coverage area per head, activation temperature, pipe sizes, design pressure', documentation: 'Hydraulic calculations, BS EN 12845 compliance statement' },
];

const seedSampleProject = (userId) => {
  try {
    const existing = db.prepare('SELECT id FROM projects WHERE user_id = ? LIMIT 1').get(userId);
    if (!existing) {
      const id = uuidv4();
      const now = new Date().toISOString();
      db.prepare(
        'INSERT INTO projects (id, name, user_id, acc_hub_id, acc_project_id, acc_default_folder, created_at, updated_at) VALUES (?, ?, ?, NULL, NULL, NULL, ?, ?)'
      ).run(id, 'Sample Project', userId, now, now);
      console.log(`Seeded Sample Project for user ${userId}`);

      // Seed pre-compiled LOIN table for the sample project
      const insertLoin = db.prepare(`
        INSERT INTO loin_rows (id, project_id, discipline, stage, element, geometry, alphanumeric, documentation, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)
      `);
      for (const row of SAMPLE_LOIN_ROWS) {
        insertLoin.run(uuidv4(), id, row.discipline, row.stage, row.element, row.geometry, row.alphanumeric, row.documentation, now, now);
      }
      console.log(`Seeded ${SAMPLE_LOIN_ROWS.length} LOIN rows for Sample Project`);
    }
  } catch (err) {
    console.error('Failed to seed Sample Project:', err && err.message);
  }
};

// Validate JWT_SECRET is configured
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is required in production');
  }
  console.warn('WARNING: JWT_SECRET not set, using insecure default for development only');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-for-production';
const JWT_EXPIRES_IN = '24h';
const BCRYPT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
};

/**
 * Verify a password against a hash
 */
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token for a user
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify a JWT token and return the payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Create a new user
 */
const createUser = async (email, password, name) => {
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const id = uuidv4();
  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO users (id, email, password_hash, name, created_at, updated_at, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `);

  stmt.run(id, email, passwordHash, name, now, now);

  // Generate verification token and send verification email
  try {
    const token = createEmailVerificationToken(id);
    const appBase = process.env.APP_BASE_URL || 'http://localhost:3000';
    const verificationUrl = `${appBase}/verify-email?token=${token}`;
    const mail = verificationEmail({ name, verificationUrl });
    // fire-and-forget; if it fails we'll log error
    emailService.sendMail({ to: email, subject: mail.subject, text: mail.text, html: mail.html })
      .catch(err => console.error('Failed to send verification email:', err && err.message));
  } catch (err) {
    console.error('Error creating or sending verification token:', err && err.message);
  }

  return {
    id,
    email,
    name,
    created_at: now,
    updated_at: now,
    is_active: 1,
    email_verified: 0
  };
};

/**
 * Authenticate a user with email and password
 */
const authenticateUser = async (email, password) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.is_active) {
    throw new Error('Account is inactive');
  }

  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.email_verified) {
    throw new Error('Email not verified');
  }

  // Update last login
  const now = new Date().toISOString();
  db.prepare('UPDATE users SET last_login = ? WHERE id = ?').run(now, user.id);

  // Safety net: ensure the user always has a Sample Project, even if seeding
  // was missed at verification time (e.g. pre-existing users, failed seed).
  seedSampleProject(user.id);

  // Return user without password hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Create an email verification token for a user.
 * Returns the token string.
 */
const createEmailVerificationToken = (userId) => {
  const id = uuidv4();
  const token = uuidv4();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  const stmt = db.prepare(`
    INSERT INTO email_verification_tokens (id, user_id, token, expires_at, uses, max_uses, used, created_at)
    VALUES (?, ?, ?, ?, 0, 5, 0, ?)
  `);

  stmt.run(id, userId, token, expiresAt, now);
  return token;
};

/**
 * Verify an email verification token. Returns user id on success.
 */
const verifyEmailToken = (token) => {
  const row = db.prepare('SELECT * FROM email_verification_tokens WHERE token = ?').get(token);
  if (!row) return null;

  const now = new Date();
  const expiresAt = new Date(row.expires_at);
  if (now > expiresAt) return null;

  if (row.used && row.used === 1) return null;
  if (row.uses >= row.max_uses) return null;

  // Mark email verified on user
  db.prepare('UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?').run(new Date().toISOString(), row.user_id);

  // Seed a Sample Project for the user if they don't have one yet
  seedSampleProject(row.user_id);

  // Increment uses and mark used if exceeded
  const newUses = (row.uses || 0) + 1;
  const willBeUsed = newUses >= (row.max_uses || 5) ? 1 : 0;
  db.prepare('UPDATE email_verification_tokens SET uses = ?, used = ? WHERE id = ?').run(newUses, willBeUsed, row.id);

  return row.user_id;
};

/**
 * Get user by ID
 */
const getUserById = (id) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

  if (!user) {
    return null;
  }

  // Return user without password hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Get user by email
 */
const getUserByEmail = (email) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    return null;
  }

  // Return user without password hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Create a password reset token
 */
const createPasswordResetToken = (userId) => {
  const id = uuidv4();
  const token = uuidv4();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

  const stmt = db.prepare(`
    INSERT INTO password_reset_tokens (id, user_id, token, expires_at, used, created_at)
    VALUES (?, ?, ?, ?, 0, ?)
  `);

  stmt.run(id, userId, token, expiresAt, now);

  return token;
};

/**
 * Verify a password reset token
 */
const verifyPasswordResetToken = (token) => {
  const resetToken = db.prepare(`
    SELECT * FROM password_reset_tokens
    WHERE token = ? AND used = 0
  `).get(token);

  if (!resetToken) {
    return null;
  }

  // Check if token is expired
  const now = new Date();
  const expiresAt = new Date(resetToken.expires_at);

  if (now > expiresAt) {
    return null;
  }

  return resetToken;
};

/**
 * Reset user password using a reset token
 */
const resetPassword = async (token, newPassword) => {
  const resetToken = verifyPasswordResetToken(token);

  if (!resetToken) {
    throw new Error('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(newPassword);
  const now = new Date().toISOString();

  // Update password
  db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
    .run(passwordHash, now, resetToken.user_id);

  // Mark token as used
  db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE id = ?')
    .run(resetToken.id);

  return true;
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  createUser,
  authenticateUser,
  getUserById,
  getUserByEmail,
  createEmailVerificationToken,
  verifyEmailToken,
  createPasswordResetToken,
  verifyPasswordResetToken,
  resetPassword
};
