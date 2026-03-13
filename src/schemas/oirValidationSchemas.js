import { z } from 'zod';

// OIR form validation — permissive schema; most fields optional.
// Required: execSummary (Step 0).

const optionalString = z.string().optional().or(z.literal(''));
const optionalArray = z.array(z.any()).optional();

export const fullOirSchema = z.object({
  // Step 0
  execSummary: z.string().min(1, 'Executive summary is required'),

  // Step 1
  organizationName: optionalString,
  businessDrivers: optionalString,
  assetPortfolioOverview: optionalString,
  assetTypes: optionalArray,
  informationUseCases: optionalString,

  // Step 2
  currentMaturityLevel: optionalString,
  targetMaturityLevel: optionalString,
  maturityGapAnalysis: optionalString,
  maturityRoadmapSummary: optionalString,

  // Step 3
  classificationApproach: optionalString,
  classificationTable: optionalArray,
  metadataStandards: optionalString,
  assetDataSchema: optionalArray,
  aimRequirementsOverview: optionalString,

  // Step 4
  regulatoryRequirements: optionalString,
  regulatoryTable: optionalArray,
  reportingKpis: optionalArray,
  reportingCycles: optionalString,
  auditRequirements: optionalString,

  // Step 5
  bimStrategyStatement: optionalString,
  softwareStrategy: optionalString,
  softwarePlatforms: optionalArray,
  dataOwnership: optionalString,
  dataLifecyclePolicy: optionalString,
  dataGovernanceTable: optionalArray,

  // Step 6
  currentCapabilityAssessment: optionalString,
  trainingStrategy: optionalString,
  capacityPlan: optionalArray,
  implementationPhases: optionalArray,
  successMetrics: optionalString,
  risksAndMitigations: optionalArray
}).passthrough();

export function validateOirStepData(stepIndex, data) {
  if (!data || typeof data !== 'object') {
    return { success: true, errors: {} };
  }
  const result = fullOirSchema.safeParse(data);
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
