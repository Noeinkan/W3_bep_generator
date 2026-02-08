import React from 'react';
import cn from '../../utils/cn';
import { button as buttonTheme } from '../../config/theme';

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
        buttonTheme.base,
        buttonTheme.variants[variant] || buttonTheme.variants.primary,
        buttonTheme.sizes[size] || buttonTheme.sizes.md,
        fullWidth && 'w-full',
        isDisabled && buttonTheme.disabled,
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
