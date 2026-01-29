import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Zap, ExternalLink } from 'lucide-react';
import { useBepForm } from '../../../contexts/BepFormContext';

/**
 * Layout component for BEP Generator routes
 * Provides common header navigation for all BEP routes
 */
const BepLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bepType } = useBepForm();

  const goToTidpManager = () => {
    navigate('/tidp-midp');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" data-page-uri={location.pathname}>
      {/* Header with navigation */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5 lg:py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 lg:space-x-3">
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">BEP Generator</h1>
              <p className="text-sm lg:text-base text-gray-600">Create professional BIM Execution Plans</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-3">
            <button
              onClick={goToTidpManager}
              className="inline-flex items-center px-2.5 lg:px-3 py-1.5 lg:py-2 text-sm lg:text-base text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1.5 lg:mr-2" />
              TIDP/MIDP Manager
            </button>
          </div>
        </div>
      </div>

      {/* Nested route content */}
      <Outlet />
    </div>
  );
};

export default BepLayout;
