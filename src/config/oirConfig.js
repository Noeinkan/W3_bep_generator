/**
 * oirConfig.js — OIR barrel
 *
 * ISO 19650 Organizational Information Requirements (OIR) structure.
 * Steps and field definitions for the OIR authoring form.
 */
import { OIR_STEPS, OIR_STEP_CATEGORIES } from './oirSteps';
import { oirFormFields, getOirFormFields } from './oirFormFieldsData.js';

const OIR_CONFIG = {
  categories: OIR_STEP_CATEGORIES,
  steps: OIR_STEPS,
  formFields: oirFormFields,
  getFormFields: getOirFormFields
};

export default OIR_CONFIG;
