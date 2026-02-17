import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import CONFIG from '../../../config/bepConfig';
import ProgressBar from './ProgressBar';
import DeliveryStatus from './DeliveryStatus';
import { cn } from '../../../utils/cn';
import { bepUi } from '../../pages/bep/bepUiClasses';

const ProgressSidebar = React.memo(({ steps, currentStep, completedSections, onStepClick, validateStep, tidpData = [], midpData = [] }) => (
  <div className={cn(bepUi.panel, 'rounded-xl border border-ui-border bg-ui-surface shadow-sm p-6')}>
    <h2 className="text-lg font-semibold text-ui-text mb-4">Progress Overview</h2>
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isComplete = completedSections.has(index);
        const isValid = validateStep(index);
        const isCurrent = currentStep === index;

        return (
          <div
            key={index}
            className={cn(
              'flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors border',
              isCurrent
                ? 'bg-ui-primary/10 border-ui-primary/30'
                : isComplete
                  ? 'bg-ui-success-bg border-ui-border'
                  : 'bg-ui-surface border-transparent hover:bg-ui-muted hover:border-ui-border'
            )}
            onClick={() => onStepClick(index)}
          >
            <div className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
              isCurrent
                ? 'bg-ui-primary text-white'
                : isComplete
                  ? 'bg-ui-success text-white'
                  : 'bg-ui-muted text-ui-text-muted'
            )}>
              {isComplete ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm font-medium',
                isCurrent ? 'text-ui-primary' : isComplete ? 'text-ui-success' : 'text-ui-text'
              )}>
                {step.title}
              </p>
              <p className="text-xs text-ui-text-muted mt-1">{step.description}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                CONFIG.categories[step.category].bg
              }`}>
                {step.category}
              </span>
            </div>
            {!isValid && index !== currentStep && (
              <AlertCircle className="w-4 h-4 text-ui-warning flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>

    <ProgressBar completed={completedSections.size} total={steps.length} />
    <DeliveryStatus tidpData={tidpData} midpData={midpData} />

    <div className="mt-4 pt-4 border-t border-ui-border">
      <div className="text-xs text-ui-text-muted space-y-1">
        {Object.keys(CONFIG.categories).map(category => (
          <div key={category} className="flex justify-between">
            <span>{category}:</span>
            <span>
              {steps.filter((s, i) => s.category === category && completedSections.has(i)).length}/
              {steps.filter(s => s.category === category).length}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
));

export default ProgressSidebar;