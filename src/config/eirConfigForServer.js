/**
 * Server-safe EIR config (no lucide-react).
 * Used by Node for EIR document export (HTML/PDF) via dynamic import().
 */
import { EIR_STEPS_DATA, EIR_STEP_CATEGORIES } from './eirStepsData.js';
import { eirFormFields, getEirFormFields } from './eirFormFieldsData.js';

export default {
  categories: EIR_STEP_CATEGORIES,
  steps: EIR_STEPS_DATA,
  formFields: eirFormFields,
  getFormFields: getEirFormFields
};
