/**
 * In-memory cache for Guided AI generated questions.
 * Key: (field_type, step_name). TTL: configurable via env, default 5 minutes.
 * Lazy eviction: entries are treated as expired when read if past TTL.
 */

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

const ttlMs = parseInt(process.env.GUIDED_AI_QUESTIONS_CACHE_TTL_MS, 10) || DEFAULT_TTL_MS;
const cache = new Map();

function buildKey(fieldType, stepName) {
  const step = stepName != null && String(stepName).trim() ? String(stepName).trim() : '';
  return `${fieldType}:${step}`;
}

function get(fieldType, stepName) {
  const key = buildKey(fieldType, stepName);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > ttlMs) {
    cache.delete(key);
    return null;
  }
  return { questions: entry.questions, field_type: entry.field_type };
}

function set(fieldType, stepName, questions, field_type) {
  const key = buildKey(fieldType, stepName);
  cache.set(key, {
    questions,
    field_type: field_type || fieldType,
    cachedAt: Date.now()
  });
}

module.exports = { get, set };
