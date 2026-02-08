/**
 * Centralized theme constants for the BEP Generator.
 * All reusable Tailwind class strings in one place.
 *
 * Usage:
 *   import { typography, input } from '../config/theme';
 *   <label className={typography.fieldLabel}>...</label>
 *   <input className={cn(input.base, error && input.error)} />
 */

// ── Colors (semantic tokens) ──────────────────────────────
export const colors = {
  primary:     'text-blue-600',
  primaryDark: 'text-blue-700',
  secondary:   'text-gray-600',
  success:     'text-green-600',
  warning:     'text-amber-600',
  danger:      'text-red-500',
  muted:       'text-gray-400',
  body:        'text-gray-700',
  heading:     'text-gray-900',

  bg: {
    primary:      'bg-blue-600',
    primaryHover: 'bg-blue-700',
    success:      'bg-green-600',
    danger:       'bg-red-600',
    muted:        'bg-gray-50',
    white:        'bg-white',
  },

  border: {
    light:   'border-gray-200',
    default: 'border-gray-300',
    primary: 'border-blue-500',
    danger:  'border-red-500',
  },
};

// ── Typography ────────────────────────────────────────────
export const typography = {
  // Step/page title — "1. BEP Type & Project Info"
  stepTitle: 'text-xl font-bold text-gray-900',

  // Section header — "1.1 Project Info" (subsection divider)
  sectionHeader:        'text-base font-semibold text-gray-900',
  sectionHeaderNumber:  'text-blue-600 font-semibold',
  sectionHeaderWrapper: 'border-b border-gray-200 pb-3 mb-4',

  // Field label — "1.2 Project Name" (input label, header-like)
  fieldLabel:        'text-sm font-semibold text-gray-900',
  fieldLabelNumber:  'text-blue-600 font-semibold',
  fieldLabelWrapper: 'flex items-center gap-2 mb-2',

  // Body text
  body:      'text-sm text-gray-700',
  bodyLarge: 'text-base text-gray-700',

  // Helper / secondary text
  small:  'text-xs text-gray-500',
  helper: 'text-sm text-gray-500',

  // Required indicator
  required: 'text-red-500 ml-1',
};

// ── Form Inputs ───────────────────────────────────────────
export const input = {
  base:     'w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  disabled: 'bg-gray-100 cursor-not-allowed',
  error:    'border-red-500',
};

// ── Field Error ───────────────────────────────────────────
export const fieldError = {
  base: 'text-red-500 text-sm mt-1',
};

// ── Buttons ───────────────────────────────────────────────
export const button = {
  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
  variants: {
    primary:   'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost:     'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
    success:   'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  },
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  },
  disabled: 'opacity-50 cursor-not-allowed',
};

// ── Tables ────────────────────────────────────────────────
export const table = {
  headerCell: 'px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200',
  bodyCell:   'px-4 py-3 border-b border-gray-200',
  row:        'hover:bg-gray-50 transition-colors',
  wrapper:    'w-full border border-gray-200 rounded-lg overflow-hidden',
};

// ── Feedback Alerts ───────────────────────────────────────
export const alert = {
  info:    'p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800',
  success: 'p-4 bg-green-50 border border-green-200 rounded-lg text-green-800',
  warning: 'p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800',
  error:   'p-4 bg-red-50 border border-red-200 rounded-lg text-red-800',
};

// ── Cards / Panels ────────────────────────────────────────
export const card = {
  base:   'bg-white rounded-lg shadow-sm border border-gray-200',
  padded: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
};

// ── Badges ────────────────────────────────────────────────
export const badge = {
  base:   'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
  blue:   'bg-blue-100 text-blue-800',
  green:  'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  red:    'bg-red-100 text-red-800',
  gray:   'bg-gray-100 text-gray-800',
};

// ── Convenience: default export with all sections ─────────
const theme = { colors, typography, input, fieldError, button, table, alert, card, badge };
export default theme;
