import React from 'react';
import { CheckCircle, Calendar, FileText, Users, TrendingUp, BarChart3 } from 'lucide-react';

const ISOComplianceSection = () => {
  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            ISO 19650 Compliance Built-In
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive implementation of ISO 19650-2:2018 requirements for information management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clause 5.1 & 5.3</h3>
            <p className="text-sm text-gray-700">Information management process and information requirements framework</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clause 5.4</h3>
            <p className="text-sm text-gray-700">Information delivery planning with TIDP/MIDP framework</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clause 5.6 & 5.7</h3>
            <p className="text-sm text-gray-700">Information production methods and Common Data Environment workflows</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Annex A</h3>
            <p className="text-sm text-gray-700">Responsibility matrices for information management activities and deliverables</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">LOIN Management</h3>
            <p className="text-sm text-gray-700">Level of Information Need specification and tracking for all deliverables</p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border-2 border-teal-200">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Validation & QA</h3>
            <p className="text-sm text-gray-700">Quality gates, acceptance criteria, and comprehensive validation checks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISOComplianceSection;
