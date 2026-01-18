import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Fullscreen modal component for table viewing
 * Based on FullscreenDiagramModal with features:
 * - Browser fullscreen API support
 * - Hierarchical ESC handling (exit fullscreen first, then modal)
 * - Fade-in/out animations
 * - Accessibility (ARIA, focus trap, initial focus)
 * - Responsive design with ResizeObserver
 * - Full page overlay (only MainLayout top bar visible)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback when modal closes
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} props.title - Title for the table view
 * @param {string} [props.mainTopbarSelector='nav.bg-white.shadow-sm.border-b'] - Selector for MainLayout top navigation bar
 * @param {boolean} [props.closeOnClickOutside=false] - Allow closing by clicking overlay
 */
const FullscreenTableModal = ({
  isOpen,
  onClose,
  children,
  title = 'Table View',
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
      } else {
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
      // Prevent body scroll when modal is open - in modo più sicuro
      const originalOverflow = document.body.style.overflow;
      const scrollY = window.scrollY;

      // Blocca lo scroll senza causare layout shift
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      // NON forzare il focus sul modale - lascia che TipTap/ProseMirror gestiscano il focus autonomamente
      // Altrimenti l'editor perde il focus dopo il primo carattere inserito

      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);

        // Ripristina lo scroll correttamente
        document.body.style.overflow = originalOverflow;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.height = '';

        // Riposiziona la pagina dove era
        window.scrollTo(0, scrollY);

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
  }, []);

  const toggleBrowserFullscreen = useCallback(() => {
    if (!fullscreenSupported) {
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
    <>
      {/* Overlay - covers everything below the MainLayout topbar */}
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
        aria-label={`${title} - Fullscreen View`}
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
        {/* Header bar with controls */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between shadow-lg z-10">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
            <span className="text-white font-semibold text-sm sm:text-base">
              {title}
            </span>
            <span className="text-blue-200 text-xs sm:text-sm hidden md:inline">
              Press ESC to {isBrowserFullscreen ? 'exit fullscreen' : 'close'}
            </span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Browser Fullscreen Toggle - only if supported */}
            {fullscreenSupported && (
              <button
                onClick={toggleBrowserFullscreen}
                className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                title={isBrowserFullscreen ? 'Exit Browser Fullscreen (ESC)' : 'Enter Browser Fullscreen'}
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
            {/* Exit button */}
            <button
              onClick={onClose}
              className="flex items-center space-x-1 sm:space-x-2 bg-white/20 hover:bg-white/30 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
              title="Exit Fullscreen View (ESC)"
              aria-label="Exit fullscreen view"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              <span className="hidden sm:inline text-sm">Exit</span>
            </button>
          </div>
        </div>

        {/* Content area - with overflow auto for scrolling */}
        <div
          ref={contentRef}
          className="absolute left-0 right-0 bottom-0 overflow-auto"
          style={{
            top: window.innerWidth < 640 ? '40px' : '52px',
            height: window.innerWidth < 640 ? 'calc(100% - 40px)' : 'calc(100% - 52px)',
            width: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );

  // Use Portal to render at the body level, bypassing all parent containers
  return createPortal(modalContent, document.body);
};

FullscreenTableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  mainTopbarSelector: PropTypes.string,
  closeOnClickOutside: PropTypes.bool,
};

// Wrap with memo to prevent unnecessary re-renders when parent re-renders
// but props haven't changed (children are compared by reference)
export default memo(FullscreenTableModal);
