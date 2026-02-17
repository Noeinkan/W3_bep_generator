const crypto = require('crypto');
const db = require('../db/database');

const DEV_FALLBACK_KEY_SEED = 'bep-generator-local-dev-fallback-key';

class EncryptedSecretService {
  constructor() {
    this.key = this.deriveKey();
  }

  deriveKey() {
    const configuredKey = process.env.LOCAL_ENCRYPTION_KEY;
    const keySeed = configuredKey || DEV_FALLBACK_KEY_SEED;

    if (!configuredKey) {
      console.warn('⚠️ LOCAL_ENCRYPTION_KEY is not set. Using local development fallback key.');
    }

    return crypto.createHash('sha256').update(String(keySeed)).digest();
  }

  generateId() {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return crypto.randomBytes(16).toString('hex');
  }

  encryptValue(plainValue) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(String(plainValue), 'utf8'),
      cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return {
      encryptedValue: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64')
    };
  }

  decryptValue(encryptedValue, iv, authTag) {
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(iv, 'base64')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, 'base64')),
      decipher.final()
    ]);

    return decrypted.toString('utf8');
  }

  setSecret(projectId, secretType, plainValue) {
    if (!projectId || !secretType || plainValue === undefined || plainValue === null) {
      throw new Error('projectId, secretType, and plainValue are required');
    }

    const now = new Date().toISOString();
    const encrypted = this.encryptValue(plainValue);

    const existing = db.prepare(
      'SELECT id FROM acc_secrets WHERE project_id = ? AND secret_type = ?'
    ).get(projectId, secretType);

    if (existing) {
      db.prepare(`
        UPDATE acc_secrets
        SET encrypted_value = ?, iv = ?, auth_tag = ?, updated_at = ?
        WHERE project_id = ? AND secret_type = ?
      `).run(
        encrypted.encryptedValue,
        encrypted.iv,
        encrypted.authTag,
        now,
        projectId,
        secretType
      );

      return true;
    }

    db.prepare(`
      INSERT INTO acc_secrets (id, project_id, secret_type, encrypted_value, iv, auth_tag, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      this.generateId(),
      projectId,
      secretType,
      encrypted.encryptedValue,
      encrypted.iv,
      encrypted.authTag,
      now,
      now
    );

    return true;
  }

  getSecret(projectId, secretType) {
    if (!projectId || !secretType) {
      throw new Error('projectId and secretType are required');
    }

    const row = db.prepare(
      'SELECT encrypted_value, iv, auth_tag FROM acc_secrets WHERE project_id = ? AND secret_type = ?'
    ).get(projectId, secretType);

    if (!row) {
      return null;
    }

    return this.decryptValue(row.encrypted_value, row.iv, row.auth_tag);
  }

  deleteSecret(projectId, secretType) {
    if (!projectId || !secretType) {
      throw new Error('projectId and secretType are required');
    }

    const result = db.prepare(
      'DELETE FROM acc_secrets WHERE project_id = ? AND secret_type = ?'
    ).run(projectId, secretType);

    return result.changes > 0;
  }
}

module.exports = new EncryptedSecretService();
