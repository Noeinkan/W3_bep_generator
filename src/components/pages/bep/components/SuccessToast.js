import React from 'react';

/**
 * Success toast notification component
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the toast
 * @param {string} props.message - Message to display (default: "Draft saved successfully!")
 */
const SuccessToast = ({ show, message = 'Draft saved successfully!' }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default SuccessToast;
