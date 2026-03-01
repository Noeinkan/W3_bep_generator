/**
 * Resolve {{snippet:key}} placeholders in text. Shared by form render and export.
 * @param {string} text - String that may contain {{snippet:key}}
 * @param {Object.<string, string>} map - key -> value
 * @returns {string} Text with placeholders replaced; unknown keys left as {{snippet:key}}
 */
const SNIPPET_PATTERN = /\{\{snippet:([a-zA-Z0-9_]+)\}\}/g;

export function resolveSnippetsInText(text, map) {
  if (typeof text !== 'string') return text;
  if (!map || typeof map !== 'object') return text;
  return text.replace(SNIPPET_PATTERN, (_, key) =>
    map[key] != null ? String(map[key]) : `{{snippet:${key}}}`
  );
}

/**
 * Resolve snippet placeholders in an object's string values (e.g. field label, placeholder).
 * @param {Object} obj - Object with optional label, placeholder, introPlaceholder, etc.
 * @param {Object.<string, string>} map - snippet key -> value
 * @returns {Object} New object with same keys, string values resolved
 */
export function resolveSnippetsInField(field, map) {
  if (!field || !map) return field;
  const out = { ...field };
  const keys = ['label', 'placeholder', 'introPlaceholder', 'help_text'];
  keys.forEach((k) => {
    if (typeof out[k] === 'string') out[k] = resolveSnippetsInText(out[k], map);
  });
  return out;
}
