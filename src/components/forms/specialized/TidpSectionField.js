import React from 'react';
import FieldHeader from '../base/FieldHeader';
import FieldError from '../base/FieldError';
import { Calendar } from 'lucide-react';

const TidpSectionField = ({ field, value, onChange, error, formData }) => {
  const { name, label, number, placeholder } = field;

  return (
    <div>
      <FieldHeader
        fieldName={name}
        label={label}
        number={number}
        required={field.required}
      />

      <textarea
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem('bep-return-url', window.location.pathname + window.location.search);
          window.location.href = '/tidp-midp';
        }}
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 font-medium"
      >
        <Calendar className="w-5 h-5" />
        <span>Open TIDP/MIDP Manager</span>
      </button>
      <FieldError error={error} />
    </div>
  );
};

export default TidpSectionField;
