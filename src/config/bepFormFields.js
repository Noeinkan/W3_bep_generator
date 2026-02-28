import { Upload } from 'lucide-react';
import { formFields, sharedFormFields, getFormFields } from './bepFormFieldsData.js';

export const eirStep = {
  enabled: true,
  title: 'Upload EIR',
  description: 'Upload client EIR documents for automatic analysis',
  icon: Upload,
  isOptional: true
};

export { formFields, sharedFormFields, getFormFields };
