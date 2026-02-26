/**
 * Single source of truth for UI design token names.
 * Used by tailwind.config.js to build theme.extend.colors.ui.
 * Values live in src/styles/ui-tokens.css (:root).
 *
 * When adding a token:
 * 1. Add the key here (dashed style, e.g. "text-muted").
 * 2. Add --ui-<key> in ui-tokens.css.
 * Tailwind utilities (e.g. text-ui-text-muted, bg-ui-canvas) stay in sync.
 */
const UI_TOKEN_KEYS = [
  "canvas",
  "surface",
  "muted",
  "border",
  "border-strong",
  "text",
  "text-muted",
  "text-soft",
  "primary",
  "primary-hover",
  "primary-gradient-end",
  "success",
  "success-bg",
  "warning",
  "warning-bg",
];

/** Build theme.extend.colors.ui: { [key]: "var(--ui-<key>)" } */
function getTailwindUiColors() {
  return Object.fromEntries(
    UI_TOKEN_KEYS.map((key) => [key, `var(--ui-${key})`])
  );
}

module.exports = { UI_TOKEN_KEYS, getTailwindUiColors };
