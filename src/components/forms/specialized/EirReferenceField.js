import React from 'react';
import { useNavigate } from 'react-router-dom';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import { FileSearch } from 'lucide-react';

const EirReferenceField = ({ field, value, onChange, error, formData }) => {
  const navigate = useNavigate();
  const { label, number } = field;

  const openEirManager = () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('bep-return-url', window.location.pathname + window.location.search);
    }
    navigate('/eir-manager');
  };

  return (
    <div>
      <FieldHeader
        fieldName={field.name}
        label={label}
        number={number}
        required={field.required}
      />

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Exchange Information Requirements</h4>
            <p className="text-sm text-gray-600 mb-4">
              Manage client EIR documents and requirements for this project. The BEP is your response to the EIR.
            </p>
            <button
              type="button"
              onClick={openEirManager}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
            >
              <FileSearch className="w-4 h-4" />
              <span>Open EIR Manager</span>
            </button>
          </div>
        </div>
      </div>
      <FieldError error={error} />
    </div>
  );
};

export default EirReferenceField;
