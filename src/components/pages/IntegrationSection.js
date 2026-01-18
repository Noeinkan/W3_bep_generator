import React from 'react';
import { FileText, BarChart3, Table2, ArrowRight } from 'lucide-react';

const IntegrationSection = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Seamless Integration
          </h2>
          <p className="text-base lg:text-lg text-gray-300 mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed">
            All three products work together seamlessly. Reference your TIDP/MIDP plans and IDRM matrices directly in your BEP documents,
            with auto-sync capabilities and unified navigation for maximum productivity.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white border-opacity-20">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white text-sm lg:text-base">BEP Generator</div>
                <div className="text-blue-200 text-xs">Professional BEPs</div>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-white opacity-50 hidden md:block" aria-hidden="true" />

            <div className="flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white border-opacity-20">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white text-sm lg:text-base">TIDP/MIDP Manager</div>
                <div className="text-green-200 text-xs">Information Delivery</div>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-white opacity-50 hidden md:block" aria-hidden="true" />

            <div className="flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white border-opacity-20">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Table2 className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white text-sm lg:text-base">Responsibility Matrix Manager</div>
                <div className="text-purple-200 text-xs">Responsibility Matrices</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSection;
