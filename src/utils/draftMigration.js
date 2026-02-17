import { draftStorageService } from '../services/draftStorageService';
import { draftApiService } from '../services/draftApiService';

const BACKUP_RETENTION_DAYS = 30;
const MIGRATION_META_PREFIX = 'bepDraftMigration_';
const BACKUP_KEY_PREFIX = 'bepDraftBackup_';

const getMigrationMetaKey = (userId) => `${MIGRATION_META_PREFIX}${userId}`;

const daysToMs = (days) => days * 24 * 60 * 60 * 1000;

const readMigrationMeta = (userId) => {
  try {
    const raw = localStorage.getItem(getMigrationMetaKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to parse draft migration metadata:', error);
    return null;
  }
};

const writeMigrationMeta = (userId, meta) => {
  localStorage.setItem(getMigrationMetaKey(userId), JSON.stringify(meta));
};

const buildBackupKey = (userId, timestamp) => `${BACKUP_KEY_PREFIX}${userId}_${timestamp}`;

const hasLegacyDrafts = (userId) => {
  try {
    const drafts = draftStorageService.loadDrafts(userId);
    return Object.keys(drafts).length > 0;
  } catch (error) {
    console.error('Failed to inspect local drafts:', error);
    return false;
  }
};

const cleanupExpiredBackups = (userId) => {
  const meta = readMigrationMeta(userId);
  if (!meta?.backupKey || !meta?.backupExpiresAt) {
    return;
  }

  const now = Date.now();
  const expiresAt = new Date(meta.backupExpiresAt).getTime();

  if (!Number.isNaN(expiresAt) && now > expiresAt) {
    localStorage.removeItem(meta.backupKey);
    localStorage.removeItem(getMigrationMetaKey(userId));
  }
};

export const migrateLocalDraftsToBackend = async (userId) => {
  if (!userId) {
    return { migrated: false, reason: 'missing-user' };
  }

  cleanupExpiredBackups(userId);

  const existingMeta = readMigrationMeta(userId);
  if (existingMeta?.completed) {
    return { migrated: false, reason: 'already-migrated', meta: existingMeta };
  }

  if (!hasLegacyDrafts(userId)) {
    return { migrated: false, reason: 'no-local-drafts' };
  }

  const localDrafts = draftStorageService.loadDrafts(userId);
  const draftCount = Object.keys(localDrafts).length;

  const nowIso = new Date().toISOString();
  const backupExpiresAt = new Date(Date.now() + daysToMs(BACKUP_RETENTION_DAYS)).toISOString();
  const backupKey = buildBackupKey(userId, Date.now());

  localStorage.setItem(backupKey, JSON.stringify(localDrafts));

  const migrationResult = await draftApiService.migrateDrafts(localDrafts);

  draftStorageService.clearAllDrafts(userId);

  const meta = {
    completed: true,
    migratedAt: nowIso,
    backupKey,
    backupExpiresAt,
    sourceCount: draftCount,
    migratedCount: migrationResult?.migrated?.length || 0,
    skippedCount: migrationResult?.skipped?.length || 0,
    failedCount: migrationResult?.failed?.length || 0
  };

  writeMigrationMeta(userId, meta);

  return {
    migrated: true,
    result: migrationResult,
    meta
  };
};

export const runDraftMigrationOnAppLoad = async (userId) => {
  try {
    return await migrateLocalDraftsToBackend(userId);
  } catch (error) {
    console.error('Draft migration on app load failed:', error);
    return { migrated: false, reason: 'error', error: error.message };
  }
};

export const getDraftMigrationMeta = (userId) => {
  if (!userId) return null;
  cleanupExpiredBackups(userId);
  return readMigrationMeta(userId);
};
