/**
 * Default empty OIR form data.
 * All string fields default to '', all table fields default to [].
 */
const emptyOirData = {
  // Step 0 — Executive Summary
  execSummary: '',

  // Step 1 — Organizational Objectives & Asset Portfolio
  organizationName: '',
  businessDrivers: '',
  assetPortfolioOverview: '',
  assetTypes: [],
  informationUseCases: '',

  // Step 2 — Information Management Maturity
  currentMaturityLevel: '',
  targetMaturityLevel: '',
  maturityGapAnalysis: '',
  maturityRoadmapSummary: '',

  // Step 3 — Asset Information Framework
  classificationApproach: '',
  classificationTable: [],
  metadataStandards: '',
  assetDataSchema: [],
  aimRequirementsOverview: '',

  // Step 4 — Regulatory, Compliance & Reporting
  regulatoryRequirements: '',
  regulatoryTable: [],
  reportingKpis: [],
  reportingCycles: '',
  auditRequirements: '',

  // Step 5 — Digital Strategy & Data Governance
  bimStrategyStatement: '',
  softwareStrategy: '',
  softwarePlatforms: [],
  dataOwnership: '',
  dataLifecyclePolicy: '',
  dataGovernanceTable: [],

  // Step 6 — Capacity, Capability & Implementation Roadmap
  currentCapabilityAssessment: '',
  trainingStrategy: '',
  capacityPlan: [],
  implementationPhases: [],
  successMetrics: '',
  risksAndMitigations: []
};

export default emptyOirData;
