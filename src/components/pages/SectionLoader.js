import React from 'react';

const SectionLoader = ({ isDark = false }) => {
  return (
    <div className={`py-12 lg:py-16 ${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2"
               style={{ borderColor: isDark ? '#ffffff' : '#3b82f6' }}
               role="status"
               aria-label="Loading section">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionLoader;
