import React from 'react';

/**
 * ProgressBar — Shared BEP completion progress bar.
 *
 * @param {Object} props
 * @param {number} props.completed - Number of completed sections
 * @param {number} props.total - Total number of sections
 */
const ProgressBar = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="text-sm text-gray-600 mb-2">
        BEP Completion: {percentage}%
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);
