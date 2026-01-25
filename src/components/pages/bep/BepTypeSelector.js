import React from 'react';
import { CheckCircle, Zap, Target, Eye, ArrowRight } from 'lucide-react';
import CONFIG from '../../../config/bepConfig';

const BepTypeSelector = ({ bepType, setBepType, onProceed }) => (
  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-2 sm:p-3">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl p-3 sm:p-4 border border-slate-200">
      {/* Header Section */}
      <div className="text-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 tracking-tight">
          Choose Your BEP Type
        </h1>
        <p className="text-sm text-slate-600 mb-3 max-w-2xl mx-auto">
          Select the BIM Execution Plan that best fits your project needs
        </p>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-2.5 text-left max-w-3xl mx-auto">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">?</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-900 mb-0.5">What is a BEP?</h3>
              <p className="text-xs text-blue-800 leading-relaxed">
                A BIM Execution Plan outlines how information management will be handled by the delivery team.
                It establishes how information requirements are managed and delivered by all project parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {Object.entries(CONFIG.bepTypeDefinitions).map(([key, definition]) => {
          const IconComponent = definition.icon;
          const isSelected = bepType === key;

          return (
            <div
              key={key}
              className={`group relative bg-white border rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.005] shadow hover:shadow-lg break-words ${
                isSelected
                  ? `border-${definition.color}-500 bg-gradient-to-br from-${definition.color}-50 to-${definition.color}-100 ring-1 ring-${definition.color}-200`
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setBepType(key)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setBepType(key);
                }
              }}
            >
              {/* Card Header */}
              <div className="p-2.5 pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-1.5 rounded-lg flex-shrink-0 transition-all duration-200 ${
                    isSelected
                      ? `bg-${definition.color}-100`
                      : 'bg-slate-100 group-hover:bg-slate-200'
                  }`}>
                    <IconComponent className={`w-6 h-6 transition-colors duration-200 ${
                      isSelected ? `text-${definition.color}-600` : 'text-slate-600'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-base font-bold transition-colors duration-200 ${
                        isSelected ? `text-${definition.color}-900` : 'text-slate-900'
                      }`}>
                        {definition.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isSelected
                          ? `bg-${definition.color}-100 text-${definition.color}-700`
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {definition.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-2.5 pt-2">
                <p className="text-slate-700 mb-2.5 leading-snug text-xs">
                  {definition.description}
                </p>

                {/* Key Information */}
                <div className="space-y-1.5">
                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <Target className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-slate-900">Purpose</h4>
                      <p className="text-xs text-slate-600 leading-snug">{definition.purpose}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                      <Eye className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-slate-900">Focus</h4>
                      <p className="text-xs text-slate-600 leading-snug">{definition.focus}</p>
                    </div>
                  </div>
                </div>

                {/* Language Style Box */}
                <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-xs">💬</span>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Language</h4>
                  </div>
                  <p className="text-slate-600 italic leading-snug text-xs">{definition.language}</p>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow animate-pulse">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              )}

              {/* Hover CTA */}
              <div className={`absolute bottom-2 left-2 right-2 transition-all duration-200 ${
                isSelected ? 'opacity-0 translate-y-1' : 'opacity-0 group-hover:opacity-100 group-hover:translate-y-0'
              }`}>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-center text-xs font-medium shadow">
                  Select this BEP Type →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Proceed Button */}
      <div className="flex justify-center">
        <button
          onClick={() => bepType && onProceed(bepType)}
          disabled={!bepType}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            bepType
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>{bepType ? `Continue with ${CONFIG.bepTypeDefinitions[bepType].title}` : 'Select a BEP type'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default BepTypeSelector;
