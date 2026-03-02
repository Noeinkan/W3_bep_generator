/**
 * Empty EIR data structure — used as default for new EIR documents.
 * All field names must match eirFormFieldsData.js.
 */

const EMPTY_EIR_DATA = {
  // Step 0: Executive Summary
  executiveSummary: '',

  // Step 1: Introduction
  eirPurpose: '',
  goals: '',
  objectives: '',
  informationRequirementsHierarchy: '',
  preBepRequirement: '',
  supplementaryDocuments: '',
  supplierCapabilityAssessment: '',
  mobilisationPlanRequirement: '',
  informationDeliveryRiskAssessment: '',
  deliveryTeamBepRequirement: '',

  // Step 2: Information Requirements
  informationPurpose: '',
  planOfWork: '',
  informationDeliveryMilestones: [],
  informationSecurityRequirements: '',
  spatialCoordinationRequirements: '',
  pimRequirements: '',
  aimRequirements: '',
  informationKpis: [],
  healthSafetyRiskManagement: '',

  // Step 3: Information Standards
  projectSpecificStandards: '',
  informationContainerIdentification: {
    overview: '',
    namingFields: [],
    namingPattern: '',
    deliverableAttributes: []
  },
  cdeMetadataRequirements: [],
  lodLoiMatrix: [],
  dataExchangeFormats: [],
  softwarePlatforms: [],
  informationModelQuality: '',

  // Step 4: Information Production Methods
  responsibilityMatrix: [],
  cdeWorkflow: '',
  informationExchangeFrequency: '',
  mobilisationProcedures: '',
  trainingRequirements: '',
  authorisationAcceptanceProcess: '',
  spatialCoordinationStrategy: '',
  legacyInformationRequirements: '',
  captureExistingAssetInformation: '',
  informationContainerBreakdownStructure: '',
  lessonsLearnt: '',

  // Step 5: Appendices
  appendixResponsibilityMatrix: [],
  appendixMilestonesTable: [],
  appendixLodLoiMatrix: [],
  appendixSoftwareSchedule: [],
  appendixCdeSpec: '',
  appendixSecurityMetadata: [],
  appendixClassificationSystem: [],
  appendixExampleRequirementsTables: ''
};

export default EMPTY_EIR_DATA;
