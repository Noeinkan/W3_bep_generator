/**
 * eirConfig.js — EIR barrel
 *
 * ISO 19650 Exchange Information Requirements (EIR) structure.
 * Steps and field definitions for the EIR authoring form.
 */
import { EIR_STEPS, EIR_STEP_CATEGORIES } from './eirSteps';
import { eirFormFields, getEirFormFields } from './eirFormFieldsData.js';

const EIR_CONFIG = {
  categories: EIR_STEP_CATEGORIES,
  steps: EIR_STEPS,
  formFields: eirFormFields,
  getFormFields: getEirFormFields
};

export default EIR_CONFIG;
