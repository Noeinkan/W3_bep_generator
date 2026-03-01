import React from 'react';
import { useNavigate } from 'react-router-dom';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import { Layers } from 'lucide-react';

const LoinReferenceField = ({ field, value, onChange, error, formData }) => {
  const navigate = useNavigate();
  const { label, number } = field;

  const openLoinTables = () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('bep-return-url', window.location.pathname + window.location.search);
    }
    navigate('/loin-tables');
  };

  return (
    <div>
      <FieldHeader
        fieldName={field.name}
        label={label}
        number={number}
        required={field.required}
      />

      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Level of Information Need Tables</h4>
            <p className="text-sm text-gray-600 mb-4">
              Manage LOIN tables by discipline, stage, and element. Define quality, quantity, and granularity of information per ISO 19650.
            </p>
            <button
              type="button"
              onClick={openLoinTables}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
            >
              <Layers className="w-4 h-4" />
              <span>Open LOIN Tables</span>
            </button>
          </div>
        </div>
      </div>
      <FieldError error={error} />
    </div>
  );
};

export default LoinReferenceField;
