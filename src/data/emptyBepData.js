/** Column schemas for resource allocation tables */
export const RESOURCE_COLUMNS_PRE = ['Role', 'Proposed Personnel', 'Key Competencies/Experience', 'Anticipated Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes'];
export const RESOURCE_COLUMNS_POST = ['Role', 'Assigned Personnel', 'Key Competencies/Experience', 'Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes'];

/**
 * Empty BEP data structure — used as base for new BEPs and merged with templates.
 * Clone via `getEmptyBepData()` in templateRegistry.js before mutating.
 * @type {Object}
 */
// Default rows for Section 1 signposted documents (emptyBepData and template merge)
const SIGNPOSTED_DOCUMENTS_DEFAULT = [
  { 'Document': 'Information Standard (IS)', 'Reference / Title': '', 'Location / CDE Path': '', 'Status': '' },
  { 'Document': 'Information Production Methods and Procedures (IPMP)', 'Reference / Title': '', 'Location / CDE Path': '', 'Status': '' },
  { 'Document': 'Master Information Delivery Plan (MIDP)', 'Reference / Title': '', 'Location / CDE Path': '', 'Status': '' },
  { 'Document': 'Information Risk Register', 'Reference / Title': '', 'Location / CDE Path': '', 'Status': '' },
  { 'Document': 'Mobilisation Plan', 'Reference / Title': '', 'Location / CDE Path': '', 'Status': '' },
  { 'Document': 'Federation Strategy', 'Reference / Title': '', 'Location / CDE Path': '', 'Status': '' }
];

// Default rows for ISO 19650 Party Definitions (Term + Definition pre-filled; Role on This Project empty)
const ISO_19650_DEFINITIONS_DEFAULT = [
  { 'Term': 'Task Team', 'ISO 19650 Definition': 'Appointed party or lead appointed party responsible for producing information (ISO 19650-2).', 'Role on This Project': '' },
  { 'Term': 'Appointed Party', 'ISO 19650 Definition': 'Organisation or individual appointed by the appointing party to contribute to the delivery of the project (ISO 19650-2).', 'Role on This Project': '' },
  { 'Term': 'Lead Appointed Party (LAP)', 'ISO 19650 Definition': 'Appointed party with responsibility for leading the delivery of the information management function (ISO 19650-2).', 'Role on This Project': '' },
  { 'Term': 'Integrated Project Delivery Team (IPDT)', 'ISO 19650 Definition': 'Collaborative team spanning appointing party, lead appointed party and task teams (ISO 19650-2).', 'Role on This Project': '' },
  { 'Term': 'Appointing Party', 'ISO 19650 Definition': 'Organisation or individual that initiates the project and appoints other parties to contribute to it (ISO 19650-2).', 'Role on This Project': '' }
];

const EMPTY_BEP_DATA = {
  // Section 1 Introduction fields
  eirPirReference: '',
  signpostedDocuments: [...SIGNPOSTED_DOCUMENTS_DEFAULT],
  iso19650Definitions: [...ISO_19650_DEFINITIONS_DEFAULT],

  // Common fields for both BEP types
  projectName: '',
  projectNumber: '',
  projectDescription: '',
  projectType: '',
  appointingParty: '',

  // Pre-appointment specific fields
  proposedTimeline: '',
  estimatedBudget: '',
  tenderApproach: '',
  proposedLead: '',
  proposedInfoManager: '',

  // Executive Summary fields
  projectContext: '',
  bimStrategy: '',
  keyCommitments: {
    intro: '',
    table: []
  },
  keyContacts: [],
  valueProposition: '',

  proposedTeamLeaders: [],
  teamCapabilities: '',
  proposedResourceAllocation: {
    columns: RESOURCE_COLUMNS_PRE,
    data: []
  },
  proposedMobilizationPlan: '',
  subcontractors: [],
  proposedBimGoals: '',
  proposedObjectives: '',
  intendedBimUses: [],

  // Post-appointment specific fields
  confirmedTimeline: '',
  confirmedBudget: '',
  deliveryApproach: '',
  referencedMaterial: {
    intro: '',
    table: []
  },
  leadAppointedParty: '',
  informationManager: '',
  assignedTeamLeaders: [],
  finalizedParties: [],
  resourceAllocationTable: {
    columns: RESOURCE_COLUMNS_POST,
    data: []
  },
  mobilizationPlan: '',
  resourceAllocation: '',
  informationManagementResponsibilities: '',
  organizationalStructure: {
    id: 'appointing_default',
    name: 'Appointing Party',
    role: 'Appointing Party',
    leadGroups: []
  },
  taskTeamsBreakdown: [],
  confirmedBimGoals: '',
  implementationObjectives: '',
  finalBimUses: [],

  // Legacy fields for backward compatibility
  bimUses: [],
  taskTeamLeaders: '',
  appointedParties: '',
  informationPurposes: [],
  geometricalInfo: '',
  alphanumericalInfo: '',
  documentationInfo: '',
  informationFormats: [],
  projectInformationRequirements: '',
  midpDescription: '',
  keyMilestones: [],
  tidpRequirements: '',
  mobilisationPlan: '',
  teamCapabilitySummary: '',
  taskTeamExchange: '',
  modelReferencing3d: '',
  milestoneInformation: [],
  informationRiskRegister: [],
  workflowStates: [],
  bimSoftware: [],
  fileFormats: [],
  hardwareRequirements: '',
  networkRequirements: '',
  interoperabilityNeeds: '',
  informationBreakdownStrategy: '',
  federationProcess: '',
  softwareHardwareInfrastructure: [],
  documentControlInfo: '',
  modelingStandards: [],
  namingConventions: {
    overview: '',
    namingFields: [],
    namingPattern: '',
    deliverableAttributes: []
  },
  fileStructure: '',
  fileStructureDiagram: '',
  dataExchangeProtocols: [],
  qaFramework: [],
  modelValidation: '',
  reviewProcesses: '',
  approvalWorkflows: '',
  complianceVerification: '',
  dataClassification: [],
  accessPermissions: '',
  encryptionRequirements: '',
  dataTransferProtocols: '',
  privacyConsiderations: '',
  bimCompetencyLevels: '',
  trainingRequirements: '',
  certificationNeeds: '',
  projectSpecificTraining: '',
  coordinationMeetings: '',
  clashDetectionWorkflow: '',
  issueResolution: '',
  communicationProtocols: '',
  federationStrategy: {
    overview: '',
    definitionAndPurposes: {
      definition: '',
      purposes: []
    },
    modelBreakdownStructure: {
      hierarchyLevels: [
        { level: 'Asset', description: '' },
        { level: 'Design Package', description: '' },
        { level: 'Discipline', description: '' }
      ],
      principles: {
        uniclassAlignment: '',
        maxFileSize: '',
        ownership: ''
      }
    },
    modelRegister: {
      columns: ['Model ID', 'Model Name', 'Discipline', 'Design Package', 'Format', 'Owner', 'Maintenance Responsibility', 'ACC Location', 'Status', 'Notes'],
      data: []
    },
    coordinationBaseline: {
      sharedLevelsGrids: '',
      geolocationVerification: [],
      coordinateSystemRef: ''
    },
    federationResponsibility: '',
    singleFileFormat: '',
    federationProcessSteps: [],
    issueCreationRequirements: [],
    ipmpReference: '',
    federationFlowchart: null,
    federationSchedule: {
      columns: ['Activity', 'Frequency', 'Day/Time', 'Location', 'Responsible'],
      data: []
    },
    coordinationByStage: {
      columns: ['Stage', 'Federation Frequency', 'Submission Day', 'Review Day', 'Notes'],
      data: []
    },
    clashResponsibilities: {
      columns: ['Name', 'Role', 'Run Clash', 'Review', 'Resolve', 'Sign-off', 'Escalate'],
      data: []
    },
    clashRulesets: {
      categoryA: [],
      categoryB: [],
      categoryC: []
    },
    clashMatrix: {
      disciplines: [
        'Architecture',
        'Structure',
        'MEP (HVAC)',
        'MEP (Electrical)',
        'MEP (Plumbing)',
        'Facades',
        'Site/Civil',
        'Fire Protection'
      ],
      clashes: []  // Will be auto-populated by component's useEffect with 8 default clashes
    },
    configuration: {
      approach: 'discipline',
      frequency: 'weekly',
      tools: [],
      modelBreakdown: []
    },
    coordinationProcedures: ''
  },
  informationRisks: '',
  technologyRisks: '',
  riskMitigation: '',
  contingencyPlans: '',
  performanceMetrics: '',
  monitoringProcedures: '',
  auditTrails: '',
  updateProcesses: '',

  // Additional shared fields
  bimGoals: '',
  primaryObjectives: '',
  collaborativeProductionGoals: '',

  alignmentStrategy: {
    meetingSchedule: {
      columns: ['Meeting Type', 'Frequency', 'Key Participants', 'Standard Agenda Items', 'Duration'],
      data: []
    },
    raciReference: '',
    namingStandards: '',
    qualityTools: {
      columns: ['Tool/Software', 'Check Type', 'Check Frequency', 'Responsible Role', 'Action on Failure'],
      data: []
    },
    trainingPlan: {
      columns: ['Role/Personnel', 'Training Topic', 'Provider/Method', 'Timeline', 'Competency Verification'],
      data: []
    },
    kpis: {
      columns: ['KPI Name', 'Measurement Metric', 'Target Value', 'Monitoring Frequency', 'Owner'],
      data: []
    },
    alignmentStrategy: ''
  },

  cdeStrategy: '',
  cdePlatforms: [],
  accessControl: '',
  securityMeasures: '',
  backupProcedures: '',

  // Volume Strategy and Classification Systems
  volumeStrategy: '',
  classificationSystems: [],
  classificationStandards: [],

  // BIM Value Applications
  bimValueApplications: '',
  valueMetrics: [],
  strategicAlignment: '',

  // Appendices Data
  responsibilityMatrix: [],
  cobieRequirements: [],
  fileNamingExamples: '',
  exchangeWorkflow: []
};

export default EMPTY_BEP_DATA;
