import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import FocusLock from 'react-focus-lock';
import PropTypes from 'prop-types';

/**
 * Enhanced Fullscreen modal component for diagram builder focus mode
 * Inspired by Miro's focus mode with advanced features:
 * - Browser fullscreen API support (like Miro's presentation mode)
 * - Hierarchical ESC handling (exit fullscreen first, then modal)
 * - Fade-in/out animations
 * - Accessibility (ARIA, focus trap, initial focus)
 * - Responsive design with ResizeObserver
 * - Click-outside to close
 * - Full page overlay (only MainLayout top bar visible)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback when modal closes
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} [props.mainTopbarSelector='nav.bg-white.shadow-sm.border-b'] - Selector for MainLayout top navigation bar
 * @param {boolean} [props.closeOnClickOutside=false] - Allow closing by clicking overlay
 */
const FullscreenDiagramModal = ({
  isOpen,
  onClose,
  children,
  mainTopbarSelector = 'nav.bg-white.shadow-sm.border-b',
  closeOnClickOutside = false
}) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mainTopbarHeight, setMainTopbarHeight] = useState(64); // Default MainLayout topbar height
  const [fullscreenSupported, setFullscreenSupported] = useState(true);

  // Calculate dimensions using ResizeObserver for precision
  const updateDimensions = useCallback(() => {
    try {
      // Find the MainLayout top navigation bar
      const mainTopbar = document.querySelector(mainTopbarSelector);
      if (mainTopbar) {
        const rect = mainTopbar.getBoundingClientRect();
        setMainTopbarHeight(rect.height);
        console.log('MainLayout topbar height updated:', rect.height);
      } else {
        console.warn(`MainLayout topbar "${mainTopbarSelector}" not found, using default 64px`);
        setMainTopbarHeight(64);
      }
    } catch (error) {
      console.error('Error calculating dimensions:', error);
      setMainTopbarHeight(64);
    }
  }, [mainTopbarSelector]);

  // Setup ResizeObserver for MainLayout topbar
  useEffect(() => {
    if (!isOpen) return;

    updateDimensions();

    const mainTopbar = document.querySelector(mainTopbarSelector);

    // Create ResizeObserver for main topbar
    const topbarObserver = mainTopbar ? new ResizeObserver(() => {
      const rect = mainTopbar.getBoundingClientRect();
      setMainTopbarHeight(rect.height);
    }) : null;

    // Observe main topbar
    if (mainTopbar) topbarObserver?.observe(mainTopbar);

    // Fallback: also listen to window resize
    window.addEventListener('resize', updateDimensions);

    return () => {
      topbarObserver?.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isOpen, updateDimensions, mainTopbarSelector]);

  // Handle fade-in animation
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger CSS transition
      const timeout = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle ESC key and fullscreen changes
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        // Hierarchical ESC: first exit browser fullscreen, then close modal
        if (isBrowserFullscreen) {
          // Inline to avoid dependency
          if (document.fullscreenElement) {
            const exitFullscreen = document.exitFullscreen ||
              document.webkitExitFullscreen ||
              document.mozCancelFullScreen ||
              document.msExitFullscreen;
            if (exitFullscreen) {
              exitFullscreen.call(document).catch(() => {});
            }
          }
        } else {
          onClose();
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      // Prevent body scroll when modal is open
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';

      // Set initial focus to modal
      if (modalRef.current) {
        modalRef.current.focus();
      }

      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
        document.body.style.height = '';
        // Exit fullscreen when modal closes
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      };
    }
  }, [isOpen, onClose, isBrowserFullscreen]);

  // Check fullscreen API support
  useEffect(() => {
    const supported = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
    setFullscreenSupported(supported);
    if (!supported) {
      console.warn('Fullscreen API not supported in this browser');
    }
  }, []);

  const toggleBrowserFullscreen = useCallback(() => {
    if (!fullscreenSupported) {
      console.warn('Fullscreen not supported');
      return;
    }

    try {
      if (!document.fullscreenElement && modalRef.current) {
        const requestFullscreen = modalRef.current.requestFullscreen ||
          modalRef.current.webkitRequestFullscreen ||
          modalRef.current.mozRequestFullScreen ||
          modalRef.current.msRequestFullscreen;

        if (requestFullscreen) {
          requestFullscreen.call(modalRef.current).catch(err => {
            console.error('Fullscreen request failed:', err);
            setFullscreenSupported(false);
          });
        }
      } else if (document.fullscreenElement) {
        const exitFullscreen = document.exitFullscreen ||
          document.webkitExitFullscreen ||
          document.mozCancelFullScreen ||
          document.msExitFullscreen;

        if (exitFullscreen) {
          exitFullscreen.call(document).catch(() => {});
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, [fullscreenSupported]);

  // Handle click outside to close
  const handleOverlayClick = useCallback((e) => {
    // Only close if clicking the overlay itself, not the content
    if (closeOnClickOutside && !isBrowserFullscreen && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnClickOutside, isBrowserFullscreen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <FocusLock returnFocus>
      {/* Overlay - covers everything below the MainLayout topbar, click to close (if enabled and not in fullscreen) */}
      {closeOnClickOutside && !isBrowserFullscreen && (
        <div
          className="fixed bg-black/20"
          style={{
            top: `${mainTopbarHeight}px`,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998
          }}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Modal - Full page overlay below MainLayout topbar */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Diagram Focus Mode"
        tabIndex={-1}
        className="fixed bg-white transition-opacity duration-300 ease-in-out shadow-2xl"
        style={{
          position: 'fixed',
          top: `${mainTopbarHeight}px`,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: `calc(100vh - ${mainTopbarHeight}px)`,
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar with controls - responsive */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between shadow-lg z-10">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
            <span className="text-white font-semibold text-sm sm:text-base hidden sm:inline">
              Focus Mode
            </span>
            <span className="text-purple-200 text-xs sm:text-sm hidden md:inline">
              Press ESC to {isBrowserFullscreen ? 'exit fullscreen' : 'close'}
            </span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Browser Fullscreen Toggle - only if supported */}
            {fullscreenSupported && (
              <button
                onClick={toggleBrowserFullscreen}
                className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                title={isBrowserFullscreen ? 'Exit Browser Fullscreen (ESC)' : 'Enter Browser Fullscreen (F11)'}
                aria-label={isBrowserFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
              >
                {isBrowserFullscreen ? (
                  <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline text-sm">
                  {isBrowserFullscreen ? 'Windowed' : 'Fullscreen'}
                </span>
              </button>
            )}
            {/* Exit Focus Mode */}
            <button
              onClick={onClose}
              className="flex items-center space-x-1 sm:space-x-2 bg-white/20 hover:bg-white/30 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              title="Exit Focus Mode (ESC)"
              aria-label="Exit focus mode"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              <span className="hidden sm:inline text-sm">Exit</span>
            </button>
          </div>
        </div>

        {/* Content area - responsive height calculation, with overflow hidden on parent */}
        <div
          ref={contentRef}
          className="absolute left-0 right-0 bottom-0"
          style={{
            top: window.innerWidth < 640 ? '40px' : '52px',
            height: window.innerWidth < 640 ? 'calc(100% - 40px)' : 'calc(100% - 52px)',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </FocusLock>
  );

  // Use Portal to render at the body level, bypassing all parent containers
  return createPortal(modalContent, document.body);
};

FullscreenDiagramModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  mainTopbarSelector: PropTypes.string,
  closeOnClickOutside: PropTypes.bool,
};

export default FullscreenDiagramModal;
