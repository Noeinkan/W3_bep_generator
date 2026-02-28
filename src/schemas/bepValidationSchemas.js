import { z } from 'zod';

// Common field schemas
const requiredString = z.string().min(1, 'This field is required');
const optionalString = z.string().optional();
const requiredArray = z.array(z.string()).min(1, 'At least one item is required');
const optionalArray = z.array(z.string()).optional();

// Step 0: Project Information
export const projectInfoSchema = z.object({
  projectName: requiredString.min(3, 'Project name must be at least 3 characters'),
  projectNumber: requiredString,
  projectLocation: requiredString,
  clientName: requiredString,
  projectDescription: requiredString.min(10, 'Project description must be at least 10 characters'),
  projectType: requiredString,
  projectValue: optionalString,
  projectDuration: optionalString,
  contractType: optionalString,
});

// Step 1: Team Structure
export const teamStructureSchema = z.object({
  bimManager: requiredString,
  bimManagerEmail: requiredString.email('Invalid email address'),
  bimManagerPhone: optionalString,
  bimCoordinator: optionalString,
  bimCoordinatorEmail: optionalString,
  projectManager: requiredString,
  projectManagerEmail: requiredString.email('Invalid email address'),
  teamMembers: optionalArray,
  roles: optionalArray,
});

// Step 2: BIM Uses & Goals
export const bimUsesSchema = z.object({
  primaryBimUses: requiredArray,
  secondaryBimUses: optionalArray,
  projectGoals: requiredString.min(10, 'Project goals must be at least 10 characters'),
  bimObjectives: optionalString,
  performanceMetrics: optionalArray,
});

// Step 3: Software & Technology
export const softwareTechnologySchema = z.object({
  authoringSoftware: requiredArray,
  analysisTools: optionalArray,
  collaborationPlatform: requiredString,
  fileFormat: requiredString,
  modelingStandards: optionalString,
  namingConvention: optionalString,
  cloudStorage: optionalString,
});

// Step 4: Model Development
export const modelDevelopmentSchema = z.object({
  lodRequirements: optionalString,
  modelOrigin: optionalString,
  coordinationProcess: optionalString,
  clashDetection: optionalString,
  qualityControl: optionalString,
  modelStructure: optionalString,
  disciplineModels: optionalArray,
});

// Step 5: Information Delivery Planning
export const informationDeliverySchema = z.object({
  keyMilestones: z.array(
    z.object({
      stage: requiredString,
      description: requiredString,
      deliverables: requiredString,
      dueDate: optionalString,
    })
  ).optional(),
  deliverySchedule: optionalString,
  informationRequirements: optionalString,
  dataDrops: optionalArray,
});

// Step 6: Quality Assurance
export const qualityAssuranceSchema = z.object({
  qaProcess: optionalString,
  qaResponsibilities: optionalString,
  qaFrequency: optionalString,
  qaChecklist: optionalArray,
  issueResolution: optionalString,
});

// Step 7: Collaboration & Communication
export const collaborationSchema = z.object({
  communicationPlan: optionalString,
  meetingSchedule: optionalString,
  issueTracking: optionalString,
  documentControl: optionalString,
  changeManagement: optionalString,
});

// Federation Strategy Schema (complex object — benchmark Section 5 + Section 9)
const federationStrategySchema = z.object({
  overview: optionalString,
  definitionAndPurposes: z.object({
    definition: optionalString,
    purposes: z.array(z.string()).optional(),
  }).optional(),
  modelBreakdownStructure: z.any().optional(),
  modelRegister: z.object({
    columns: z.array(z.string()).optional(),
    data: z.array(z.any()).optional(),
  }).optional(),
  coordinationBaseline: z.any().optional(),
  federationResponsibility: optionalString,
  singleFileFormat: optionalString,
  federationProcessSteps: z.array(z.any()).optional(),
  issueCreationRequirements: z.array(z.string()).optional(),
  ipmpReference: optionalString,
  federationSchedule: z.object({ columns: z.array(z.string()).optional(), data: z.array(z.any()).optional() }).optional(),
  coordinationByStage: z.object({ columns: z.array(z.string()).optional(), data: z.array(z.any()).optional() }).optional(),
  clashResponsibilities: z.object({ columns: z.array(z.string()).optional(), data: z.array(z.any()).optional() }).optional(),
  clashRulesets: z.object({
    categoryA: z.array(z.any()).optional(),
    categoryB: z.array(z.any()).optional(),
    categoryC: z.array(z.any()).optional(),
  }).optional(),
  clashMatrix: z.object({
    disciplines: z.array(z.string()).optional(),
    clashes: z.array(z.any()).optional(),
  }).optional(),
  configuration: z.object({
    approach: optionalString,
    frequency: optionalString,
    tools: z.array(z.string()).optional(),
    modelBreakdown: z.array(z.string()).optional(),
  }).optional(),
  coordinationProcedures: optionalString,
}).optional();

// Step 8: Information Production
export const informationProductionSchema = z.object({
  modelingStandards: optionalArray,
  namingConventions: z.any().optional(), // Complex naming conventions object
  documentControlInfo: optionalString,
  fileStructure: optionalString,
  fileStructureDiagram: z.any().optional(), // Complex diagram object
  volumeStrategy: z.any().optional(), // Complex mindmap object
  informationBreakdownStrategy: optionalString,
  federationStrategy: federationStrategySchema,
  federationProcess: optionalString,
  classificationSystems: optionalArray,
  classificationStandards: optionalArray,
  dataExchangeProtocols: optionalArray,
});

// Step 9: Quality Assurance
export const qualityAssuranceControlSchema = z.object({
  qaFramework: optionalArray,
  modelValidation: optionalString,
  reviewProcesses: optionalString,
  approvalWorkflows: optionalString,
  complianceVerification: optionalString,
  modelReviewAuthorisation: optionalString,
});

// Step 10: Information Security
export const informationSecuritySchema = z.object({
  dataClassification: optionalArray,
  accessPermissions: optionalString,
  encryptionRequirements: optionalString,
  dataTransferProtocols: optionalString,
  privacyConsiderations: optionalString,
});

// Step 11: Training and Competency
export const trainingCompetencySchema = z.object({
  bimCompetencyLevels: optionalString,
  trainingRequirements: optionalString,
  certificationNeeds: optionalString,
  projectSpecificTraining: optionalString,
});

// Step 12: Coordination & Risk
export const coordinationRiskSchema = z.object({
  coordinationMeetings: optionalString,
  clashDetectionWorkflow: optionalString,
  issueResolution: optionalString,
  communicationProtocols: optionalString,
  informationRisks: optionalString,
  technologyRisks: optionalString,
  riskMitigation: optionalString,
  contingencyPlans: optionalString,
  performanceMetrics: optionalString,
  monitoringProcedures: optionalString,
  auditTrails: optionalString,
  changeManagementProcess: optionalString,
  updateProcesses: optionalString,
  projectKpis: optionalArray,
});

// Step 13: Appendices
export const appendicesSchema = z.object({
  cobieRequirements: optionalArray,
  softwareVersionMatrix: optionalArray,
  referencedDocuments: optionalString,
});

// Full BEP form schema (combine all steps)
export const fullBepSchema = z.object({
  // Step 0
  ...projectInfoSchema.shape,
  // Step 1
  ...teamStructureSchema.shape,
  // Step 2
  ...bimUsesSchema.shape,
  // Step 3
  ...softwareTechnologySchema.shape,
  // Step 4
  ...modelDevelopmentSchema.shape,
  // Step 5
  ...informationDeliverySchema.shape,
  // Step 6
  ...qualityAssuranceSchema.shape,
  // Step 7
  ...collaborationSchema.shape,
  // Step 8
  ...informationProductionSchema.shape,
  // Step 9
  ...qualityAssuranceControlSchema.shape,
  // Step 10
  ...informationSecuritySchema.shape,
  // Step 11
  ...trainingCompetencySchema.shape,
  // Step 12
  ...coordinationRiskSchema.shape,
  // Step 13
  ...appendicesSchema.shape,
});

// Map step index to schema (14 steps total: 0-13)
export const stepSchemas = [
  projectInfoSchema,              // Step 0
  teamStructureSchema,             // Step 1
  bimUsesSchema,                   // Step 2
  softwareTechnologySchema,        // Step 3
  modelDevelopmentSchema,          // Step 4
  informationDeliverySchema,       // Step 5
  qualityAssuranceSchema,          // Step 6
  collaborationSchema,             // Step 7
  informationProductionSchema,     // Step 8
  qualityAssuranceControlSchema,   // Step 9
  informationSecuritySchema,       // Step 10
  trainingCompetencySchema,        // Step 11
  coordinationRiskSchema,          // Step 12
  appendicesSchema,                // Step 13
];

// Get schema for specific step
export const getSchemaForStep = (stepIndex) => {
  return stepSchemas[stepIndex] || z.object({});
};

// Validate specific step
export const validateStepData = (stepIndex, data) => {
  // If no data provided, return no errors (form might be initializing)
  if (!data || typeof data !== 'object') {
    return { success: true, errors: {} };
  }

  const schema = getSchemaForStep(stepIndex);

  // Use safeParse to validate - this is more lenient and won't throw
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, errors: {} };
  }

  // Convert Zod errors to our error format
  const errors = {};
  if (result.error && Array.isArray(result.error.errors)) {
    result.error.errors.forEach((err) => {
      const path = Array.isArray(err.path) ? err.path.join('.') : String(err.path || 'unknown');
      errors[path] = err.message || 'Validation error';
    });
  }

  return { success: false, errors };
};
