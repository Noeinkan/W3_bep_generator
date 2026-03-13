/**
 * oirConfigForServer.js — Server-safe OIR config barrel (no React/lucide imports).
 * Used for PDF export and server-side rendering.
 */
import { OIR_STEPS_DATA, OIR_STEP_CATEGORIES } from './oirStepsData.js';
import { oirFormFields, getOirFormFields } from './oirFormFieldsData.js';

const OIR_CONFIG_FOR_SERVER = {
  categories: OIR_STEP_CATEGORIES,
  steps: OIR_STEPS_DATA,
  formFields: oirFormFields,
  getFormFields: getOirFormFields
};

export default OIR_CONFIG_FOR_SERVER;
