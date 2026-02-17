import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Layout wrapper for MIDP sub-pages with consistent header and loading states.
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Subtitle text (e.g., count of items)
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.iconGradient - Tailwind gradient classes for icon background
 * @param {boolean} props.loading - Whether data is loading
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.backRoute='/tidp-midp'] - Route for back button
 */
export const MidpSubPageLayout = ({
  title,
  subtitle,
  icon: Icon,
  iconGradient,
  loading,
  children,
  backRoute = '/tidp-midp'
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(backRoute)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`w-10 h-10 bg-gradient-to-br ${iconGradient} rounded-lg flex items-center justify-center shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
};
