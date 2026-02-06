import React from 'react';
import cn from '../../utils/cn';

/**
 * Button variants with their Tailwind class mappings.
 */
const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
};

/**
 * Button sizes with their Tailwind class mappings.
 */
const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * Shared Button component with consistent styling across the app.
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'|'success'} [props.variant='primary'] - Visual style
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size preset
 * @param {React.ReactNode} [props.icon] - Optional leading icon element
 * @param {React.ReactNode} [props.iconRight] - Optional trailing icon element
 * @param {boolean} [props.loading] - Show loading spinner and disable
 * @param {boolean} [props.fullWidth] - Stretch to 100% width
 * @param {string} [props.className] - Additional class names
 * @param {React.ReactNode} props.children - Button content
 */
const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  type = 'button',
  ...rest
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!loading && icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="ml-2 flex-shrink-0">{iconRight}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
