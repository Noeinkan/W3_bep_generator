import React, { useState } from 'react';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import { FileText } from 'lucide-react';

const DeliverablesMatrixField = ({ field, value, onChange, error, formData }) => {
  const { label, number, placeholder } = field;
  const [showMatrixManager, setShowMatrixManager] = useState(false);

  // Lazy load the manager component
  const ResponsibilityMatrixManager = React.lazy(() => import('../../responsibility-matrix/ResponsibilityMatrixManager'));

  return (
    <div>
      <FieldHeader 
        fieldName={field.name}
        label={label}
        number={number}
        required={field.required}
      />

      {showMatrixManager ? (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ResponsibilityMatrixManager
            projectId={formData.projectName || 'current'}
            onClose={() => setShowMatrixManager(false)}
          />
        </React.Suspense>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Deliverables Schedule with TIDP Sync</h4>
              <p className="text-sm text-gray-600 mb-4">
                {placeholder}
              </p>
              <button
                type="button"
                onClick={() => setShowMatrixManager(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
              >
                <FileText className="w-5 h-5" />
                <span>Open Deliverables Matrix</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <FieldError error={error} />
    </div>
  );
};

export default DeliverablesMatrixField;
