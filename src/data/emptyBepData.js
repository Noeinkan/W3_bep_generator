// Empty BEP data structure - used as base for new BEPs
const EMPTY_BEP_DATA = {
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
    columns: ['Role', 'Proposed Personnel', 'Key Competencies/Experience', 'Anticipated Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes'],
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
    columns: ['Role', 'Assigned Personnel', 'Key Competencies/Experience', 'Weekly Allocation (Hours)', 'Software/Hardware Requirements', 'Notes'],
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
