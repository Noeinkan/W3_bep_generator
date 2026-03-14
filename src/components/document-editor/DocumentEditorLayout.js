import React, { useRef } from 'react';
import { bepUi } from '../pages/bep/bepUiClasses';
import { cn } from '../../utils/cn';

/**
 * Shared document editor shell: sidebar + main (header + optional topBanner + scrollable content + footer).
 * Uses bepUi and Tailwind tokens for consistent look with BEP.
 *
 * @param {React.ReactNode} sidebar - Rendered DocumentEditorSidebar (or equivalent)
 * @param {React.ReactNode} header - Rendered DocumentEditorHeader
 * @param {React.ReactNode} footer - Rendered DocumentEditorFooter
 * @param {React.ReactNode} [topBanner] - Optional node between header and content (e.g. linked EIR banner)
 * @param {React.ReactNode} children - Main content (typically the form step card)
 * @param {string} [contentMaxWidth] - Max width class for content area (default max-w-[231mm])
 * @param {string} [dataPageUri] - data-page-uri for the shell
 * @param {boolean} [isTransitioning] - When true, content panel gets opacity/scale transition
 * @param {React.RefObject} [contentRef] - Optional ref for the scroll container (e.g. for scroll-to-top on step change)
 */
const DocumentEditorLayout = ({
  sidebar,
  header,
  footer,
  topBanner,
  children,
  contentMaxWidth = 'max-w-[231mm]',
  dataPageUri,
  isTransitioning = false,
  contentRef: contentRefProp,
}) => {
  const contentRefInternal = useRef(null);
  const contentRef = contentRefProp ?? contentRefInternal;

  return (
    <div className={cn('h-screen flex relative', bepUi.shell)} data-page-uri={dataPageUri}>
      {sidebar}

      <div className="flex-1 flex flex-col">
        {header}

        {topBanner}

        <div ref={contentRef} className={cn('flex-1', bepUi.contentScroll, 'bg-ui-canvas')} aria-label="Editor content">
          <div className={cn('mx-auto px-6 py-8', contentMaxWidth)}>
            <div
              className={cn(
                bepUi.panel,
                'bg-ui-surface border border-ui-border rounded-xl shadow-sm p-8 transition-all duration-300 ease-in-out',
                isTransitioning ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'
              )}
            >
              {children}
            </div>
          </div>
        </div>

        {footer}
      </div>
    </div>
  );
};

export default DocumentEditorLayout;
