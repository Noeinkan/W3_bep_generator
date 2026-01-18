import React from 'react';
import { CheckCircle, Zap, Target, Eye } from 'lucide-react';
import CONFIG from '../../../config/bepConfig';

const BepTypeSelector = ({ bepType, setBepType, onProceed }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-4 sm:p-5 lg:p-6 xl:p-5 2xl:p-4 border border-slate-200">
      {/* Header Section */}
      <div className="text-center mb-6 lg:mb-8">
        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-5 shadow-xl">
          <Zap className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 lg:mb-3 tracking-tight">
          Choose Your BEP Type
        </h1>
        <p className="text-base lg:text-lg text-slate-600 mb-4 lg:mb-6 max-w-3xl mx-auto leading-relaxed">
          Select the BIM Execution Plan that best fits your project needs
        </p>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 lg:p-5 text-left max-w-4xl mx-auto shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-base font-bold">?</span>
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-blue-900 mb-2">What is a BEP?</h3>
              <p className="text-sm lg:text-base text-blue-800 leading-relaxed">
                A BIM Execution Plan outlines how information management will be handled by the delivery team.
                It establishes how information requirements are managed and delivered by all project parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {Object.entries(CONFIG.bepTypeDefinitions).map(([key, definition]) => {
          const IconComponent = definition.icon;
          const isSelected = bepType === key;

          return (
            <div
              key={key}
              className={`group relative bg-white border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.01] hover:-translate-y-0.5 shadow-lg hover:shadow-xl break-words ${
                isSelected
                  ? `border-${definition.color}-500 bg-gradient-to-br from-${definition.color}-50 to-${definition.color}-100 shadow-xl ring-2 ring-${definition.color}-200 ring-opacity-50`
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xl'
              }`}
              onClick={() => {
                setBepType(key);
                setTimeout(() => onProceed(key), 300);
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setBepType(key);
                  setTimeout(() => onProceed(key), 300);
                }
              }}
            >
              {/* Card Header */}
              <div className="p-4 lg:p-5 pb-3 lg:pb-4 border-b border-slate-100">
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className={`p-2 lg:p-3 rounded-xl flex-shrink-0 transition-all duration-300 ${
                    isSelected
                      ? `bg-${definition.color}-100 shadow-md`
                      : 'bg-slate-100 group-hover:bg-slate-200'
                  }`}>
                    <IconComponent className={`w-8 h-8 lg:w-10 lg:h-10 transition-colors duration-300 ${
                      isSelected ? `text-${definition.color}-600` : 'text-slate-600'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 lg:mb-3">
                      <h3 className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                        isSelected ? `text-${definition.color}-900` : 'text-slate-900'
                      }`}>
                        {definition.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                        isSelected
                          ? `bg-${definition.color}-100 text-${definition.color}-700 shadow-sm`
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {definition.subtitle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 lg:p-5 pt-3 lg:pt-4">
                <p className="text-slate-700 mb-4 lg:mb-5 leading-relaxed text-sm lg:text-base">
                  {definition.description}
                </p>

                {/* Key Information */}
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm lg:text-base font-bold text-slate-900 mb-0.5">Purpose</h4>
                      <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">{definition.purpose}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm lg:text-base font-bold text-slate-900 mb-0.5">Focus</h4>
                      <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">{definition.focus}</p>
                    </div>
                  </div>
                </div>

                {/* Language Style Box */}
                <div className="mt-4 lg:mt-5 p-3 lg:p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">💬</span>
                    </div>
                    <h4 className="text-sm lg:text-base font-bold text-slate-900 uppercase tracking-wide">Language Style</h4>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed text-xs lg:text-sm">{definition.language}</p>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              {/* Hover CTA */}
              <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                isSelected ? 'opacity-0 translate-y-2' : 'opacity-0 group-hover:opacity-100 group-hover:translate-y-0'
              }`}>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm font-semibold shadow-md">
                  Select this BEP Type →
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Status */}
      {bepType && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 bg-green-50 border-2 border-green-200 rounded-full px-5 py-2.5 shadow-md">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-base lg:text-lg font-bold text-green-800">
              Selected: {CONFIG.bepTypeDefinitions[bepType].title}
            </span>
          </div>
          <p className="mt-2 text-sm lg:text-base text-slate-500">Proceeding automatically...</p>
        </div>
      )}
    </div>
  </div>
);

export default BepTypeSelector;
