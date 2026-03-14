import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { SIDEBAR_TOGGLE } from '../../constants/sidebarUi';
import { bepUi } from '../pages/bep/bepUiClasses';
import { cn } from '../../utils/cn';

/**
 * Shared document editor sidebar: collapsible, with title, optional extra blocks (children), and step list.
 * @param {string} title - Sidebar title (e.g. "BEP Generator", "EIR")
 * @param {string} [subtitle] - Optional subtitle
 * @param {string} [documentName] - Optional document name to show under subtitle
 * @param {Array} steps - Steps: { number, title, icon?, description?, category? }
 * @param {number} currentStep
 * @param {Set} completedSections
 * @param {Function} onStepClick
 * @param {Function} [validateStep] - (index) => errors object; if errors and not current, show warning
 * @param {Object} [categories] - Optional map categoryKey -> { bg: '...' } for step badge
 * @param {React.ReactNode} [sidebarIcon] - Icon component for title and collapsed state (e.g. Zap, FileText)
 * @param {React.ReactNode} [children] - Extra blocks above step list (Drafts button, EIR upload, DocumentStatusWidget, etc.)
 */
const DocumentEditorSidebar = ({
  title,
  subtitle,
  documentName,
  steps = [],
  currentStep,
  completedSections,
  onStepClick,
  validateStep,
  categories = {},
  sidebarIcon: SidebarIcon = FileText,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div
        className={cn(
          'w-14 flex flex-col shrink-0 items-center py-4 border-r border-ui-border bg-ui-surface',
          bepUi.sidebar,
          'rounded-none border-l-0 border-y-0 shadow-none'
        )}
      >
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className={SIDEBAR_TOGGLE.buttonCollapsed}
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <ChevronRight className={SIDEBAR_TOGGLE.iconExpand} />
        </button>
        {SidebarIcon && <SidebarIcon className="w-5 h-5 text-ui-primary mt-4" aria-hidden />}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-80 flex flex-col shrink-0 transition-[width] duration-200 ease-out',
        bepUi.sidebar,
        'rounded-none border-l-0 border-y-0 border-r border-ui-border shadow-none'
      )}
    >
      <div className="p-6 border-b border-ui-border bg-ui-surface">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-ui-text flex items-center">
              {SidebarIcon && <SidebarIcon className="w-5 h-5 text-ui-primary mr-2" />}
              {title}
            </h1>
            {subtitle && <p className="text-sm text-ui-text-muted mt-1">{subtitle}</p>}
            {documentName && (
              <p className="text-xs text-ui-primary mt-1 font-medium flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                  <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                {documentName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className={SIDEBAR_TOGGLE.buttonExpanded}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className={SIDEBAR_TOGGLE.iconCollapse} />
          </button>
        </div>
        {children}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className={cn(bepUi.panel, 'rounded-xl border border-ui-border bg-ui-surface shadow-sm p-6')}>
          <h2 className="text-lg font-semibold text-ui-text mb-4">Progress Overview</h2>
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isComplete = completedSections?.has(index) ?? false;
              const stepErrors = typeof validateStep === 'function' ? validateStep(index) : null;
              const hasErrors = stepErrors && typeof stepErrors === 'object' && Object.keys(stepErrors).length > 0;
              const isCurrent = currentStep === index;
              const IconComponent = step.icon ?? FileText;

              return (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  onClick={() => onStepClick(index)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onStepClick(index)}
                  className={cn(
                    'flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors border',
                    isCurrent
                      ? 'bg-ui-primary/10 border-ui-primary/30'
                      : isComplete
                        ? 'bg-ui-success-bg border-ui-border'
                        : 'bg-ui-surface border-transparent hover:bg-ui-muted hover:border-ui-border'
                  )}
                >
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                      isCurrent
                        ? 'bg-ui-primary text-white'
                        : isComplete
                          ? 'bg-ui-success text-white'
                          : 'bg-ui-muted text-ui-text-muted'
                    )}
                  >
                    {isComplete ? <CheckCircle className="w-4 h-4" /> : <IconComponent className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isCurrent ? 'text-ui-primary' : isComplete ? 'text-ui-success' : 'text-ui-text'
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-ui-text-muted mt-1">{step.description}</p>
                    )}
                    {step.category && categories[step.category] && (
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1',
                          categories[step.category].bg
                        )}
                      >
                        {categories[step.category].name ?? step.category}
                      </span>
                    )}
                  </div>
                  {hasErrors && index !== currentStep && (
                    <AlertCircle className="w-4 h-4 text-ui-warning flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorSidebar;
