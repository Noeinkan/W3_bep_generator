/**
 * Field Number Utility
 *
 * Calculates field numbers dynamically based on step number and field order.
 * All visible fields get sequential numbers (including section headers).
 */

/**
 * Get the display number for a field
 * @param {string|number} stepNumber - The step number (e.g., "1", "2", etc.)
 * @param {number} fieldIndex - Zero-based index of the field within the step
 * @returns {string} The field number (e.g., "1.1", "1.2", etc.)
 */
export function getFieldNumber(stepNumber, fieldIndex) {
  return `${stepNumber}.${fieldIndex + 1}`;
}

export default { getFieldNumber };
