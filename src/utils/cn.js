/**
 * Utility for joining class names, filtering out falsy values.
 * Drop-in replacement for clsx/classnames without adding a dependency.
 *
 * @param {...(string|boolean|null|undefined)} classes - Class names to join
 * @returns {string} Joined class string
 *
 * @example
 * cn('px-4', isActive && 'bg-blue-600', !isActive && 'bg-gray-200')
 * // => 'px-4 bg-blue-600' (when isActive is true)
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');

export default cn;
