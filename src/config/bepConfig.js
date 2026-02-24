/**
 * bepConfig.js — barrel re-export
 *
 * Assembles the CONFIG default export from focused sub-modules so that all
 * existing consumers (`import CONFIG from '...'`) continue to work unchanged.
 *
 * To modify specific concerns, edit the relevant module:
 *   Steps & categories  → bepSteps.js
 *   BEP type metadata   → bepTypeDefinitions.js
 *   Option lists        → bepOptions.js
 *   Field definitions   → bepFormFields.js
 */
import { BEP_STEPS, STEP_CATEGORIES } from './bepSteps';
import { BEP_TYPE_DEFINITIONS } from './bepTypeDefinitions';
import { BEP_OPTIONS } from './bepOptions';
import { eirStep, formFields, sharedFormFields, getFormFields } from './bepFormFields';

const CONFIG = {
  eirStep,
  categories: STEP_CATEGORIES,
  bepTypeDefinitions: BEP_TYPE_DEFINITIONS,
  options: BEP_OPTIONS,
  steps: BEP_STEPS,
  formFields,
  sharedFormFields,
  getFormFields,
};

export default CONFIG;
