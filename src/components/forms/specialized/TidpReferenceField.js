import React from 'react';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import { Calendar, Plus } from 'lucide-react';

const TidpReferenceField = ({ field, value, onChange, error, formData }) => {
  const { label, number } = field;

  return (
    <div>
      <FieldHeader
        fieldName={field.name}
        label={label}
        number={number}
        required={field.required}
      />

      <div className="space-y-4">
        {/* TIDPs Summary Box */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Task Information Delivery Plans</h4>
              <p className="text-sm text-gray-600 mb-4">
                Manage TIDPs for each project team/discipline. Define deliverables, schedules, and responsibilities.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem('bep-return-url', window.location.pathname + window.location.search);
                    window.location.href = '/tidp-editor';
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create TIDP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem('bep-return-url', window.location.pathname + window.location.search);
                    window.location.href = '/tidp-midp';
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Open TIDP/MIDP Manager</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FieldError error={error} />
    </div>
  );
};

export default TidpReferenceField;
