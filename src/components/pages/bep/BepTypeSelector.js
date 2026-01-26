import React from 'react';
import { CheckCircle, Zap, FileText } from 'lucide-react';
import CONFIG from '../../../config/bepConfig';

const BepTypeSelector = ({ bepType, setBepType, onProceed }) => (
  <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-7xl">
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Choose Your BEP Type
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Select the BIM Execution Plan that best fits your project needs
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Object.entries(CONFIG.bepTypeDefinitions).map(([key, definition]) => {
          const IconComponent = definition.icon;
          const isSelected = bepType === key;

          return (
            <div
              key={key}
              className={`relative bg-white rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                isSelected
                  ? 'ring-4 ring-blue-500 shadow-2xl scale-[1.02]'
                  : 'border-2 border-slate-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
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
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                </div>
              )}

              {/* Card Header with Icon */}
              <div className={`p-5 ${isSelected ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-slate-100 to-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-white'} shadow-lg`}>
                    <IconComponent className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {definition.title}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {definition.subtitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                {/* Description */}
                <p className="text-base text-slate-700 leading-relaxed">
                  {definition.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {/* Purpose */}
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-6 h-6 mt-0.5 text-blue-600 flex-shrink-0">
                      <FileText className="w-full h-full" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 mb-1">Purpose</h4>
                      <p className="text-sm text-blue-800">{definition.purpose}</p>
                    </div>
                  </div>

                  {/* Focus */}
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-6 h-6 mt-0.5 text-green-600 flex-shrink-0">
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-green-900 mb-1">Focus</h4>
                      <p className="text-sm text-green-800">{definition.focus}</p>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                      <span>💬</span>
                      <span>Language Style</span>
                    </h4>
                    <p className="text-sm text-slate-600 italic">{definition.language}</p>
                  </div>
                </div>
              </div>

              {/* Selection CTA */}
              {isSelected && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProceed(key);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-base hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Select this BEP Type →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default BepTypeSelector;
