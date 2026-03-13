import { z } from 'zod';

// EIR form validation — permissive schema; most fields optional.
// Required: executiveSummary (Step 0). Other key fields can be required per step if desired.

const optionalString = z.string().optional().or(z.literal(''));
const optionalArray = z.array(z.any()).optional();
const optionalObject = z.record(z.any()).optional();

export const fullEirSchema = z.object({
  projectName: optionalString,
  projectNumber: optionalString,
  clientOrganisation: optionalString,
  projectAddress: optionalString,
  projectDescription: optionalString,
  formOfContract: optionalString,
  projectPhasing: optionalString,
  keyContacts: optionalArray,
  executiveSummary: z.string().min(1, 'Executive summary is required'),
  eirPurpose: optionalString,
  goals: optionalString,
  objectives: optionalString,
  informationRequirementsHierarchy: optionalString,
  preBepRequirement: optionalString,
  supplementaryDocuments: optionalString,
  supplierCapabilityAssessment: optionalString,
  mobilisationPlanRequirement: optionalString,
  informationDeliveryRiskAssessment: optionalString,
  deliveryTeamBepRequirement: optionalString,
  informationPurpose: optionalString,
  bimUses: optionalArray,
  planOfWork: optionalString,
  informationDeliveryMilestones: optionalArray,
  informationSecurityRequirements: optionalString,
  spatialCoordinationRequirements: optionalString,
  pimRequirements: optionalString,
  aimRequirements: optionalString,
  informationKpis: optionalArray,
  healthSafetyRiskManagement: optionalString,
  projectSpecificStandards: optionalString,
  informationContainerIdentification: z.union([optionalObject, z.object({
    overview: optionalString,
    namingFields: optionalArray,
    namingPattern: optionalString,
    deliverableAttributes: optionalArray
  }).optional()]),
  cdeMetadataRequirements: optionalArray,
  lodLoiMatrix: optionalArray,
  dataExchangeFormats: optionalArray,
  softwarePlatforms: optionalArray,
  informationModelQuality: optionalString,
  responsibilityMatrix: optionalArray,
  cdeWorkflow: optionalString,
  informationExchangeFrequency: optionalString,
  mobilisationProcedures: optionalString,
  trainingRequirements: optionalString,
  authorisationAcceptanceProcess: optionalString,
  spatialCoordinationStrategy: optionalString,
  legacyInformationRequirements: optionalString,
  captureExistingAssetInformation: optionalString,
  informationContainerBreakdownStructure: optionalString,
  federationStrategy: optionalString,
  lessonsLearnt: optionalString,
  appendixResponsibilityMatrix: optionalArray,
  appendixMilestonesTable: optionalArray,
  appendixLodLoiMatrix: optionalArray,
  appendixSoftwareSchedule: optionalArray,
  appendixCdeSpec: optionalString,
  appendixSecurityMetadata: optionalArray,
  appendixClassificationSystem: optionalArray,
  appendixExampleRequirementsTables: optionalString
}).passthrough(); // Allow extra keys from form (e.g. future fields)

export function validateEirStepData(stepIndex, data) {
  if (!data || typeof data !== 'object') {
    return { success: true, errors: {} };
  }
  const result = fullEirSchema.safeParse(data);
  if (result.success) return { success: true, errors: {} };
  const errors = {};
  if (result.error?.errors) {
    result.error.errors.forEach((err) => {
      const path = Array.isArray(err.path) ? err.path.join('.') : String(err.path || 'unknown');
      errors[path] = err.message || 'Validation error';
    });
  }
  return { success: false, errors };
}
