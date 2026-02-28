/**
 * Server-safe BEP config: same structure as bepConfig.js but imports only
 * data modules (no lucide-react), so Node can load it for GET /template and clone/reset.
 * Frontend continues to use bepConfig.js (with icons).
 */
import { BEP_STEPS_DATA, STEP_CATEGORIES } from './bepStepsData.js';
import { BEP_OPTIONS } from './bepOptions.js';
import { formFields, sharedFormFields, getFormFields } from './bepFormFieldsData.js';

const BEP_TYPE_DEFINITIONS = {
  'pre-appointment': {
    title: 'Pre-Appointment BEP',
    subtitle: 'Tender Phase Document',
    description: 'A document outlining the prospective delivery team\'s proposed approach, capability, and capacity to meet the appointing party\'s exchange information requirements (EIRs).'
  },
  'post-appointment': {
    title: 'Post-Appointment BEP',
    subtitle: 'Project Execution Document',
    description: 'Confirms the delivery team\'s information management approach and includes the MIDP/TIDP, Information Standard response, and IPMP.'
  }
};

export default {
  categories: STEP_CATEGORIES,
  bepTypeDefinitions: BEP_TYPE_DEFINITIONS,
  options: BEP_OPTIONS,
  steps: BEP_STEPS_DATA,
  formFields,
  sharedFormFields,
  getFormFields,
};
