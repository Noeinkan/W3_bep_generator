/**
 * Empty EIR data structure — used as default for new EIR documents.
 * All field names must match eirFormFieldsData.js.
 */

const EMPTY_EIR_DATA = {
  // Step 0: Project Information
  projectName: '',
  projectNumber: '',
  clientOrganisation: '',
  projectAddress: '',
  projectDescription: '',
  formOfContract: '',
  projectPhasing: '',
  keyContacts: [],

  // Step 1: Executive Summary
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

  // Step 3: Information Requirements
  informationPurpose: '',
  bimUses: [],
  planOfWork: '',
  informationDeliveryMilestones: [],
  informationSecurityRequirements: '',
  spatialCoordinationRequirements: '',
  pimRequirements: '',
  aimRequirements: '',
  informationKpis: [],
  healthSafetyRiskManagement: '',

  // Step 4: Information Standards
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

  // Step 5: Information Production Methods
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
  federationStrategy: '',
  lessonsLearnt: '',

  // Step 6: Appendices
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
