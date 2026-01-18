import { useEffect } from 'react';

/**
 * Hook to detect clicks outside a referenced element
 * @param {React.RefObject} ref - Reference to the element to monitor
 * @param {Function} onOutsideClick - Callback when click occurs outside
 * @param {boolean} enabled - Whether the listener is active (default: true)
 */
const useOutsideClick = (ref, onOutsideClick, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, onOutsideClick, enabled]);
};

export default useOutsideClick;
