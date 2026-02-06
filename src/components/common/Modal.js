import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import cn from '../../utils/cn';

/**
 * Modal size presets
 */
const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

/**
 * Shared Modal component using React Portal.
 *
 * Provides consistent overlay, ESC-to-close, click-outside-to-close,
 * title bar, body, and footer slots.
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is visible
 * @param {Function} props.onClose - Called when the modal should close
 * @param {string} [props.title] - Optional title text
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size='md'] - Width preset
 * @param {React.ReactNode} [props.footer] - Optional footer content (buttons, etc.)
 * @param {boolean} [props.closeOnOverlay=true] - Close when clicking the overlay
 * @param {boolean} [props.closeOnEsc=true] - Close on Escape key
 * @param {string} [props.className] - Additional classes for the content panel
 * @param {React.ReactNode} props.children - Modal body content
 */
const Modal = ({
  open,
  onClose,
  title,
  size = 'md',
  footer,
  closeOnOverlay = true,
  closeOnEsc = true,
  className = '',
  children,
}) => {
  const contentRef = useRef(null);

  // ESC key handler
  const handleKeyDown = useCallback(
    (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
    >
      <div
        ref={contentRef}
        className={cn(
          'bg-white rounded-lg shadow-xl w-full',
          SIZES[size] || SIZES.md,
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className={cn('px-6 py-4', !title && 'pt-6')}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end space-x-2 px-6 py-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
