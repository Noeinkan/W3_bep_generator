import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import CONFIG from '../../../config/bepConfig';
import ProgressBar from './ProgressBar';
import DeliveryStatus from './DeliveryStatus';

const ProgressSidebar = React.memo(({ steps, currentStep, completedSections, onStepClick, validateStep, tidpData = [], midpData = [] }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-lg font-semibold mb-4">Progress Overview</h2>
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isComplete = completedSections.has(index);
        const isValid = validateStep(index);
        const isCurrent = currentStep === index;

        return (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors
              ${isCurrent ? 'bg-blue-50 border border-blue-200' :
                isComplete ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'}`}
            onClick={() => onStepClick(index)}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${isCurrent ? 'bg-blue-600 text-white' :
                isComplete ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {isComplete ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                isCurrent ? 'text-blue-900' : isComplete ? 'text-green-900' : 'text-gray-900'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                CONFIG.categories[step.category].bg
              }`}>
                {step.category}
              </span>
            </div>
            {!isValid && index !== currentStep && (
              <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>

    <ProgressBar completed={completedSections.size} total={steps.length} />
    <DeliveryStatus tidpData={tidpData} midpData={midpData} />

    <div className="mt-4 pt-4 border-t">
      <div className="text-xs text-gray-500 space-y-1">
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